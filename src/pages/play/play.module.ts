/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   25-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 27-07-2017
 */

 import { NgModule } from '@angular/core';
 import { IonicPageModule } from 'ionic-angular';
 import { PlayPage } from './play';
 import { CanvasAreasComponentModule } from '../../components/canvas-area/canvas-area.module';
 import { Platform } from 'ionic-angular';
 import { NativeAudio } from '@ionic-native/native-audio';

 @NgModule({
   declarations: [
     PlayPage
   ],
   imports: [
     CanvasAreasComponentModule,
     IonicPageModule.forChild(PlayPage),
   ],
   providers: [
     Platform,
     NativeAudio
   ],
   exports: [
     PlayPage
   ]
 })
 export class PlayModule {}
