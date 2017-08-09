/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   30-05-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 09-08-2017
 */

import { Component, OnInit } from '@angular/core';
import { NavController, Modal, ModalController, IonicPage } from 'ionic-angular';

import { Store, Action } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs/Rx';

import { State } from "../../store/reducers";
import { IAuthState } from "../../store/reducers/authReducer";
import { MainActions } from '../../store/actions/mainActions';

@IonicPage({
  name: 'HomePage',
  segment: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public storeInfo:Observable<State>;
  public userInfo:Observable<IAuthState>
  public nav$:Subscription

  constructor(
    public navCtrl:NavController,
    private store:Store<State>,
    private mainActions: MainActions,
    private modalCtrl: ModalController
  ) {
    this.storeInfo = this.store.select((state:State) => state)
    this.userInfo = this.store.select((state:State) => state.auth)
    this.nav$ = this.store.select((state:State) => state.nav).subscribe((page) => {
        if(page){
          let modal:Modal = this.modalCtrl.create(page);
          modal.present()
               .catch(err=>{
                 this.store.dispatch(<Action>{type: 'OPEN_MODAL_FAILED', payload: err})
               });
        }
    })
  }

  ngOnInit():void {
    this.store.dispatch(<Action>this.mainActions.checkAuth())
  }

  goSpaceShooter(event, user:{id:string, email:string} | null):void{
    this.navCtrl.push('SelectPlayerPage', (user)? {user: user}: null)
  }

  doLogout():void{
    this.store.dispatch(<Action>this.mainActions.logout())
  }

  doSignin():void{
    this.store.dispatch(<Action>{ type: 'OPEN_MODAL', payload: 'SignInModal' })
  }

  credits():void{
    this.navCtrl.push('CreditsPage')
  }

  topScore():void{
    this.navCtrl.push('TopScoresPage')
  }

  ionViewDidLeave():void{
    this.nav$.unsubscribe()
  }

}
