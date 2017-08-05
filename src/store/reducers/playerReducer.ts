/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   25-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 02-08-2017
 */

 import { Action } from '@ngrx/store';
 import { MainActions } from '../actions/mainActions';

 import { LEVELS, ILevels, ILevel } from "../../game-config/levels/levels";

 export interface IPlayerStats extends Object{
   id?:string
   x?:number,
   y?:number,
   width?:number,
   height?:number,
   imgUrl?:string,
   power?:number,
   life?:number

 }

 export const intitialState:IPlayerStats = {

 }

 export function reducer (state:IPlayerStats = intitialState, action:any):IPlayerStats {
   switch (action.type) {
    case MainActions.INIT:
         return Object.assign({}, intitialState)
    case MainActions.PLAYER_UPDATE:
         return Object.assign({}, state, action.payload)

     case MainActions.GET_DATAS_SUCCESS: {
         return Object.assign({}, state, action.payload.datas)
     }
     case MainActions.MOUSE_MOVING:{
          // console.log(action.payload)
          return  Object.assign({},state,action.payload)
     }
     default:
 			   return state;
 	}
 }
