/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   25-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 06-08-2017
 */


 import {Injectable} from '@angular/core';
 import { Action } from '@ngrx/store';

 /**
  * Add Todo to Todos Actions
  */
 @Injectable()
 export class MainActions {

   static INIT:string = '[INIT]-SPACE_SHOOTER_GAME'

   static MOUSE_MOVE:string = '[EVENT]-MOUSE_MOVE'
   static MOUSE_MOVING:string = '[EVENT]-MOUSE_MOVING'
   static KEY_PRESS:string = '[EVENT]-KEY_PRESS'

   static IMG_LOAD:string = '[IMAGES]-LOAD'
   static IMG_LOAD_SUCCESS:string = '[IMAGES]-LOAD_SUCCESS'

   static CONFIG_UPDATE = '[CONFIG]-UPDATE'

   static PLAYER_UPDATE = '[PLAYER]-UPDATE_CONFIG'

   static GET_DATAS = '[HTTP]-GET_DATAS'
   static GET_DATAS_SUCCESS = '[HTTP]-GET_DATAS_SUCCESS'
   static GET_DATAS_FAILED = '[HTTP]-GET_DATAS_FAILED'

   static LEVEL_UPDATE = '[LEVEL]-LEVEL_UPDATE'


   static SET_LEVEL = '[LEVEL]-SET_LEVEL'
   static IMG_GET_LIST = '[IMAGES]-GET_LIST'

 }
