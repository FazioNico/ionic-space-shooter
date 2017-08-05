/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 05-08-2017
*/

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from "./home";

@NgModule({
  imports: [
    IonicPageModule.forChild(HomePage)
  ],
  declarations: [HomePage],
  providers: [],
  exports: [
    HomePage
  ]
})
export class HomePageModule { }
