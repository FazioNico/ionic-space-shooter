/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 05-08-2017
*/


import { Component, OnInit, ViewChildren, ElementRef, Renderer, QueryList } from '@angular/core';
import { IonicPage, NavController, Col } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/take';

import { State } from "../../store/reducers";
import { IConfigStats } from "../../store/reducers/configReducer";
import { IPlayerStats } from "../../store/reducers/playerReducer";
import { MainActions } from '../../store/actions/mainActions';

@IonicPage({
  name: 'SelectPlayerPage',
  segment: 'select-player'
})
@Component({
  selector: 'select-player',
  templateUrl: 'select-player.html'
})
export class SelectPlayerPage implements OnInit{

    /**
     * Using @ViewChildren
     * Docs => https://netbasal.com/understanding-viewchildren-contentchildren-and-querylist-in-angular-896b0c689f6e
     */
    @ViewChildren(Col, { read: ElementRef }) cols: QueryList<Col>
    public storeConfig:Observable<IConfigStats>;
    public storeImgPlayer:Observable<IPlayerStats>;
    public windowDimention:{width:number;height:number};
    public subscribtion:Subscription;
    public selectedShipe:string;

    constructor(
    public navCtrl:NavController,
    private store:Store<any>,
    public platform: Platform,
    public renderer: Renderer
  ){
    console.log('Hello SelectPlayerPage')
    this.storeConfig = this.store.select((state:State) => state.config)
    this.storeConfig.take(1).subscribe((state:IConfigStats)=> {
      const CURRENT_LEVEL:number = state.levels.current
      return this.store.dispatch({
        type: MainActions.IMG_LOAD,
        payload: [state.levels.config[CURRENT_LEVEL].enemys.imgUrl]
      })
    })


    this.storeImgPlayer = this.store.select((state:State) => state.config.imgDatas).map(img=> {
      let ready:string[] = []
      img.map(item=> {
        if(item.indexOf('fighter') >0){
          ready.push(item)
        }
      })
      return ready
    })

    this.subscribtion = this.store.select((state:State) => state.player).subscribe(status => {
      console.log('subs', status)
      if(status.id){
         this.navCtrl.push('PlayPage',{ready:true})
      }
    })
  }

  ngOnInit():void{
    this.platform.ready().then(()=>{
        console.log('SelectPlayerPage Init')
        this.store.dispatch({
          type: MainActions.INIT,
        })
        this.store.dispatch({
          type: MainActions.IMG_LOAD,
          payload: ['./assets/img/fighter-01.png', './assets/img/fighter-02.png']
        })
        this.store.dispatch({
          type: MainActions.CONFIG_UPDATE,
          payload: {
            item: 'position',
            datas:{width:this.platform.width(),height:this.platform.height(), platform:this.platform.is('core')}
          }
        })
        // Events traking not working proprely with ngrx: performance CPU worning.
        //console.log(this.platform.is('core'))
        // this.store.dispatch({
        //     type: MainActions.MOUSE_MOVE
        // });
        // this.store.dispatch({
        //     type: MainActions.KEY_PRESS
        // });
    })
  }

  selectShipe(event, item:HTMLElement){
    this.cols.forEach((col:ElementRef) => {
      this.renderer.setElementClass(col.nativeElement,'selected', false)
    });
    this.renderer.setElementClass(item,'selected', true)
    this.selectedShipe = event.target.id
  }

  startGame(){
    this.store.dispatch({
        type: MainActions.GET_DATAS,
        payload: {
          element: 'player',
          path: `config/shapes/players/${this.selectedShipe}.json`,
        }
    });
  }

  ionViewDidLeave(){
    this.subscribtion.unsubscribe()
  }
}
