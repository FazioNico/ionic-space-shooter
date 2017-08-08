/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 08-08-2017
*/


import { Component, OnInit, ViewChildren, ElementRef, Renderer, QueryList } from '@angular/core';
import { IonicPage, NavController, Col } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/take';

import { State } from "../../store/reducers";
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
     * Using @ViewChildren with QueryList
     * Docs =>
     *    https://angular.io/api/core/ViewChildrenDecorator
     *    https://angular.io/api/core/QueryList
     *    https://netbasal.com/understanding-viewchildren-contentchildren-and-querylist-in-angular-896b0c689f6e
     */
    @ViewChildren(Col, { read: ElementRef }) cols: QueryList<Col>
    public storeImgPlayer:Observable<IPlayerStats>;
    public subscribtion:Subscription;
    public selectedShipe:string;

    constructor(
    public navCtrl:NavController,
    private store:Store<State>,
    public platform: Platform,
    public renderer: Renderer
  ){
    console.log('Hello SelectPlayerPage')

    this.subscribtion = this.store.select((state:State) => state.player)
                                  .subscribe(status => {
                                   //console.log('subs', status)
                                    if(status.id){
                                      this.navCtrl.push('PlayPage',{ready:true})
                                    }
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

  }

  ngOnInit():void{
    this.platform.ready().then(()=>{
        console.log('SelectPlayerPage Init')
        this.store.dispatch({
          type: MainActions.SET_LEVEL,
          payload: null
        })

        let explosionImages:string[] = [
          './assets/img/expl_1.png', './assets/img/expl_2.png', './assets/img/expl_3.png', './assets/img/expl_4.png',
          './assets/img/expl_5.png', './assets/img/expl_6.png', './assets/img/expl_7.png', './assets/img/expl_8.png',
          './assets/img/expl_9.png', './assets/img/expl_10.png', './assets/img/expl_11.png'
        ];
        let playersImages:string[] = [
          './assets/img/fighter-01.png', './assets/img/fighter-02.png'
        ]
        this.store.dispatch({
          type: MainActions.IMG_LOAD,
          payload: [...explosionImages, ...playersImages]
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

  selectShipe(event, item:HTMLElement):void{
    this.cols.forEach((col:ElementRef) => {
      this.renderer.setElementClass(col.nativeElement,'selected', false)
    });
    this.renderer.setElementClass(item,'selected', true)
    this.selectedShipe = event.target.id
  }

  startGame():void{
    this.store.dispatch({
        type: MainActions.GET_DATAS,
        payload: {
          element: 'player',
          path: `config/shapes/players/${this.selectedShipe}.json`,
        }
    });
  }

  ionViewDidLeave():void{
    this.subscribtion.unsubscribe()
  }
}
