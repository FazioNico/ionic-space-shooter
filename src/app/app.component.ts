/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   30-05-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 08-08-2017
 */

import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Store, Action } from '@ngrx/store'
import { Observable } from 'rxjs/Rx';

import { State } from "../store/reducers";
import { IErrorState } from "../store/reducers/errorReducer";
import { MainActions } from "../store/actions/mainActions";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  public storeError:Observable<IErrorState>;
  public rootPage:string = 'HomePage';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    private store: Store<State>,
    private mainActions: MainActions
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      /**
       * Using NgRx Store to get manage Error Stats
       */
       this.storeError = this.store.select(state => state.error)
       this.storeError.subscribe(error => {
         if(error){
           this.displayError(error)
         }
       })
    });
  }

  displayError(error):void {
    console.error('displayError-> ', error.toString())
    let alert = this.alertCtrl.create({
      subTitle: `
        ### Error ### <br/>
        ${error.toString()}
      `,
      buttons: [
      {
        text: 'Dismiss',
        role: 'cancel',
        handler: () => {
          // console.log('Dismiss clicked');
          this.store.dispatch(<Action>this.mainActions.errorClean())
        }
      }]
    });
    alert.present();
  }
}
