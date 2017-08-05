/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   30-05-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 05-08-2017
 */

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AppStateModule } from "../store/app-state.module";

const providers:Array<any> = [
  StatusBar,
  SplashScreen,
  {provide: ErrorHandler, useClass: IonicErrorHandler}
];
/**
 * See Ionic Docs for AppConfiguration
 * => https://ionicframework.com/docs/api/config/Config/
 */
const ionicAppConfig:Object = {
  tabsPlacement: 'top',
  mode: 'md'
};

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    AppStateModule,
    IonicModule.forRoot(MyApp, ionicAppConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: providers
})
export class AppModule {}
