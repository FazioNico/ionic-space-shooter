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

 export interface ILevelStats extends Object{
   current:number,
   config?:ILevel

 }

 export const intitialState:ILevelStats = {
   current:0,
   config: LEVELS[0]
 }

 export function reducer (state:ILevelStats = intitialState, action:any):ILevelStats {
   switch (action.type) {
    case MainActions.INIT:
         return Object.assign({}, state,intitialState)
    case MainActions.LEVEL_UPDATE:
    console.log('TODO: --->', action.payload)
         return Object.assign({}, state, {current:state.current+1,config:LEVELS[(state.current+1)]})
     default:
 			   return state;
 	}
 }
