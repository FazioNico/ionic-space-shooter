/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   07-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
 */

 import { NgModule } from '@angular/core';
 import { IonicPageModule } from 'ionic-angular';
 import { CreditsPage } from "./credits";

 @NgModule({
   imports: [
     IonicPageModule.forChild(CreditsPage)
   ],
   declarations: [CreditsPage],
   providers: [],
   exports: [CreditsPage]
 })
 export class CreditsPageModule { }
