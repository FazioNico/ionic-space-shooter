/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   25-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 12-08-2017
 */

 import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
 import { IonicPage, NavController, NavParams, ToastController, Toast, ActionSheetController, AlertController } from 'ionic-angular';
 import { NativeAudio } from '@ionic-native/native-audio';

 import { Store } from '@ngrx/store'
 import { Observable } from 'rxjs/Rx';

 import { State } from "../../store/reducers";
 import { IConfigStats } from "../../store/reducers/configReducer";
 import { IPlayerStats } from "../../store/reducers/playerReducer";
 import { ILevelStats } from "../../store/reducers/levelReducer";
 import { MainActions } from '../../store/actions/mainActions';

 import { CanvasAreaComponent } from "../../components/canvas-area/canvas-area";

 @IonicPage({
   name: 'PlayPage',
   segment: 'play',
   defaultHistory: ['SelectPlayerPage']
 })
@Component({
  selector: 'page-play',
  template: `
    <ion-content>
      <div ion-fixed>
          <ng-canvas-area
          [config]="(storeConfig|async)"
          [level]="(storeLevel|async)"
          [player]="(storePlayer|async)"
          (onEvents)="canvasEvent($event)"></ng-canvas-area>
      </div>
      <ion-fab right top>
        <button color="transparent" ion-fab (click)="presentActionSheet()">
          <ion-icon name="cog"></ion-icon>
        </button>
      </ion-fab>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayPage {

  @ViewChild(CanvasAreaComponent) ngCanvas:CanvasAreaComponent;

  public storeConfig:Observable<IConfigStats>;
  public storeLevel:Observable<ILevelStats>;
  public storePlayer:Observable<IPlayerStats>;
  public bgAudio:HTMLAudioElement;
  public playing:boolean = false

  public uniqueID:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nativeAudio: NativeAudio,
    private store:Store<any>,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public toastCtrl:ToastController

  ) {
    if(!this.navParams.get('ready')){
      this.exitGame()
      return
    }
    this.storePlayer = this.store.select((state:State) => state.player)
    this.storeLevel = this.store.select((state:State) => state.level);
    this.storeConfig = this.store.select((state:State) => state.config)
                                  .map(state=> {
                                    this.loadAudio(state.position.platform)
                                    return state
                                  })
  }

  ngAfterViewInit() {
    if(!this.navParams.get('ready')){
      return
    }
    this.ngCanvas.initGame()
  }

  loadAudio(platform:boolean):void{
      console.log('loadAudio...');
      if(this.playing)return;
      if(platform){
        // core
        console.log('native audio unavailable->  playing audio with HTML5 Audio() API')
        this.loadAudioHTMLAPI()
      }
      else {
        // TODO: Fix bug with IOS. audio not playing..
        this.uniqueID =  `bgAudio_${Date.now()}`;
        //mobile
        this.nativeAudio.preloadComplex(this.uniqueID, './assets/audio/bg.mp3', 1, 1, 0)
        .then((success)=>{
          console.log('succes preload')
          //this.nativeAudio.play(uniqueID, () => console.log(`${uniqueID} is done playing`));
          this.nativeAudio.loop(this.uniqueID)
          .then(onSuccess=>{
            console.log(`${this.uniqueID} is done playing`, onSuccess)
            //this.initGame()
          })
          .catch(error => {
            console.log(`native audio error: ${this.uniqueID} is not playing`, error)
          });
        })
        .catch(error => {
          console.log('native audio error-> ', error, ' -> playing audio with HTML5 Audio() API')
          this.loadAudioHTMLAPI()
        })
      }
      this.playing = true;
  }

  loadAudioHTMLAPI():void{
    this.bgAudio = new Audio();
    this.bgAudio.src = './assets/audio/bg.mp3';
    this.bgAudio.loop = true;
    this.bgAudio.oncanplaythrough = () =>{
      this.bgAudio.play()
    }
  }

  canvasEvent(event){
    //console.log(event)
    let alert,to;
    switch (event) {
      case 'levelup':
          //console.log('switch levelUp')
          this.store.dispatch({
            type: MainActions.LEVEL_UPDATE,
          })
          break;
      case 'gameover':
           //console.log('switch Game Over');
           this.saveMaxScore()

           alert = this.alertCtrl.create({
             subTitle: 'Play again ?',
             buttons: [
              {
                text: 'Quit',
                handler: () => {
                  //console.log('Quit clicked');
                  this.exitGame()
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  //console.log('Yes clicked');
                  this.resetGame()
                }
              }
            ]
           });
           to = setTimeout(_=> {
             alert.present();
             clearTimeout(to)
           },1500)
           break;
      case 'endofgame':
          //console.log('switch End Of Game')
          alert = this.alertCtrl.create({
            subTitle: 'Save Score ?',
            buttons: [
             {
               text: 'Quit',
               handler: () => {
                 //console.log('Quit clicked');
                 this.exitGame()
               }
             },
             {
               text: 'Yes',
               handler: () => {
                 // console.log('Yes clicked');
                 this.saveMaxScore()
                 this.exitGame()
               }
             }
           ]
          });
          to = setTimeout(_=> {
            alert.present();
            clearTimeout(to)
          },3000)
          break;
      default: null
    }
  }

  presentActionSheet() {
    this.ngCanvas.stopGame()
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        // {
        //   text: 'Save',
        //   handler: () => {
        //     console.log('Save clicked');
        //     // TODO save player setting, level & score
        //   }
        // },
        {
          text: 'Reset',
          handler: () => {
            this.resetGame()
          }
        },
        {
          text: 'Quit',
          handler: () => {
            this.exitGame()
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.ngCanvas.eofPause()
          }
        }
      ]
    });
    actionSheet.present();
  }

  ionViewDidLeave(){
    this.stopGame()
  }

  saveMaxScore():void{
    if(this.navParams.get('user')){
      this.store.dispatch({
        type: 'SAVE_MAX_SCORE',
        payload: {
          type: 'set',
          collection: 'score',
          uid:this.navParams.get('user').id,
          user: this.navParams.get('user'),
          datas:{
            current:this.ngCanvas.collCtrl.score.current || 0
          }
        }
      })
      // display confirmation score save
      let toast:Toast = this.toastCtrl.create({
        message: 'Score saved successfully',
        duration: 5000,
        position: 'top'
      });
      toast.present();
    }
    else {
      let toast:Toast = this.toastCtrl.create({
        message: 'You have to be loged to save your top socre. Go to the main menu and create your free account.',
        position: 'top',
        showCloseButton: true,
        closeButtonText: 'ok'
      });
      toast.present();
    }
  }

  stopGame():void{
    if(this.bgAudio){
      this.bgAudio.pause()
      this.playing = false;
    }
    if(this.uniqueID){
      this.nativeAudio.stop(this.uniqueID)
      this.playing = false;
    }
    if(this.ngCanvas){
      this.ngCanvas.stopGame()
      this.ngCanvas.animate = false
      if(this.ngCanvas.intCtrl)
        clearTimeout(this.ngCanvas.intCtrl.enemy)
    }
  }

  resetGame():void {
    this.ngCanvas.stopGame()
    this.ngCanvas.animate = false
    clearTimeout(this.ngCanvas.intCtrl.enemy)
    this.ngCanvas.initGame()
  }

  exitGame():void{
    this.store.dispatch({
        type: MainActions.INIT,
    });
    this.navCtrl.setRoot('HomePage')
  }
}
