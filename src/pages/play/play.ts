/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   25-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 05-08-2017
 */

 import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
 import { IonicPage, NavController, NavParams } from 'ionic-angular';
 import { Platform, ActionSheetController, AlertController } from 'ionic-angular';
 import { NativeAudio } from '@ionic-native/native-audio';

 import { Store } from '@ngrx/store'
 import { Observable } from 'rxjs/Rx';

 import { State } from "../../store/reducers";
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

  public storeConfig:Observable<any>;
  public storeLevel:Observable<any>;
  public storePlayer:Observable<any>;
  public bgAudio:HTMLAudioElement;
  public playing:boolean = false
  public subscribtion:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private nativeAudio: NativeAudio,
    private store:Store<any>,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController

  ) {
    if(!this.navParams.get('ready')){
      this.resetGame()
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
      let uniqueID:string = `bgAudio_${Date.now()}`;
      if(platform){
        // core
        console.log('native audio unavailable->  playing audio with HTML5 Audio() API')
        this.loadAudioHTMLAPI(uniqueID)
      }
      else {
        //mobile
        this.nativeAudio.preloadComplex(uniqueID, './assets/audio/bg.mp3', 1, 1, 0)
        .then((success)=>{
          console.log('succes preload')
          //this.nativeAudio.play(uniqueID, () => console.log(`${uniqueID} is done playing`));
          this.nativeAudio.loop(uniqueID)
          .then(onSuccess=>{
            console.log(`${uniqueID} is done playing`, onSuccess)
            //this.initGame()
          })
          .catch(error => {
            console.log(`native audio error: ${uniqueID} is not playing`, error)
          });
        })
        .catch(error => {
          console.log('native audio error-> ', error, ' -> playing audio with HTML5 Audio() API')
          this.loadAudioHTMLAPI(uniqueID)
        })
      }
      this.playing = true;
  }

  loadAudioHTMLAPI(uniqueID:string):void{
    this.bgAudio = new Audio();
    this.bgAudio.id = uniqueID;
    this.bgAudio.src = './assets/audio/bg.mp3';
    this.bgAudio.loop = true;
    this.bgAudio.oncanplaythrough = () =>{
      this.bgAudio.play()
    }
  }

  canvasEvent(event){
    console.log(event)
    switch (event) {
      case 'levelup':
          console.log('switch levelUp')
          this.store.dispatch({
            type: MainActions.LEVEL_UPDATE,
          })
          break;
      case 'gameover':
           console.log('switch Game Over')
           let alert = this.alertCtrl.create({
             subTitle: 'Play again ?',
             buttons: [
              {
                text: 'Quit',
                handler: () => {
                  console.log('Quit clicked');
                  this.resetGame()
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  console.log('Yes clicked');
                }
              }
            ]
           });
           let to = setTimeout(_=> {
             alert.present();
             clearTimeout(to)
           },1500)
           break;
      default: null
    }
  }


  presentActionSheet() {
    this.ngCanvas.stopGame()
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        // {
        //   text: 'Pause',
        //   handler: () => {
        //     console.log('pause clicked');
        //     (this.ngCanvas.animate)?this.ngCanvas.stopGame():this.ngCanvas.eofPause()
        //   }
        // },
        {
          text: 'Save',
          handler: () => {
            console.log('Save clicked');
            // TODO (save player setting, level & score)
          }
        },
        {
          text: 'Options',
          handler: () => {
            console.log('Options clicked');
            // TODO (volume, effect, etc...)
          }
        },
        {
          text: 'Quit',
          handler: () => {
            console.log('Quit clicked');
            this.resetGame()
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.ngCanvas.eofPause()
          }
        }
      ]
    });
    actionSheet.present();
  }

  ionViewDidLeave(){
    console.log('ionViewDidLeave')
    //this.subscribtion.unsubscribe()
    this.stopGame()
  }

  stopGame():void{
    if(this.bgAudio){
      this.bgAudio.pause()
      this.playing = false;
    }
    if(this.ngCanvas){
      this.ngCanvas.stopGame()
      this.ngCanvas.animate = false
      clearTimeout(this.ngCanvas.intCtrl.enemy)
    }
  }

  resetGame():void{
    this.store.dispatch({
        type: MainActions.INIT,
    });
    this.navCtrl.setRoot('HomePage')
  }
}
