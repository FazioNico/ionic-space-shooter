/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 26-07-2017
*/

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectPlayerPage } from "./select-player";

@NgModule({
  imports: [
    IonicPageModule.forChild(SelectPlayerPage)
  ],
  declarations: [SelectPlayerPage],
  providers: [],
  exports: [
    SelectPlayerPage
  ]
})
export class SelectPlayerModule { }
