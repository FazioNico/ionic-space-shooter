/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   08-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 08-08-2017
 */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/take';

import { State } from "../../store/reducers";
import { IDatabaseState } from "../../store/reducers/databaseReducer";
import { MainActions } from '../../store/actions/mainActions';

/**
 * Generated class for the TopScoresPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 @IonicPage({
   name: 'TopScoresPage',
   segment: 'top-scores'
 })
@Component({
  selector: 'page-top-scores',
  templateUrl: 'top-scores.html',
})
export class TopScoresPage {

  public storeDB:Observable<IDatabaseState>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store:Store<State>
  ) {
    this.storeDB = this.store.select((state:State) => state.db)
    this.store.dispatch({
        type: 'GET_DATAS_ARRAY',
        payload: 'maxScore'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopScoresPage');
  }

}
