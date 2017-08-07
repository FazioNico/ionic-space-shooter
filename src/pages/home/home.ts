/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   30-05-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
 */

import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { State } from "../../store/reducers";

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

  constructor(
    public navCtrl:NavController,
    private store:Store<State>
  ) {
    this.storeInfo = this.store.select((state:State) => state)
  }

  ngOnInit():void {
    // TODO: check user auth
  }

  goSpaceShooter(event):void{
    this.navCtrl.push('SelectPlayerPage')
  }

  goLogin(event):void{
    alert('TODO')
  }

  credits():void{
    this.navCtrl.push('CreditsPage')
  }

  topScore():void{
    alert('TODO')
  }
}
