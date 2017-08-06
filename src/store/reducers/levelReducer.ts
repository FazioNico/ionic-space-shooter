/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   25-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 06-08-2017
 */

 import { Action } from '@ngrx/store';
 import { MainActions } from '../actions/mainActions';

 import { LEVELS, ILevels, ILevel } from "../../game-config/levels/levels";

 export interface ILevelStats extends Object{
   current:number,
   maxLevel:number,
   config?:ILevel

 }

 export const intitialState:ILevelStats = {
   current:0,
   maxLevel:LEVELS.length,
   config: LEVELS[0]
 }

 export function reducer (state:ILevelStats = intitialState, action:any):ILevelStats {
   switch (action.type) {
    case MainActions.INIT:
         return Object.assign({}, state,intitialState)
    case MainActions.LEVEL_UPDATE:
    console.log('TODO: --->', action.payload)
         const NEW_LEVEL:number = state.current+1
         if(NEW_LEVEL < intitialState.maxLevel){
           return Object.assign({}, state, {current:NEW_LEVEL,config:LEVELS[NEW_LEVEL]})
         }
         else {
           return Object.assign({}, state, {current:NEW_LEVEL,config:LEVELS[state.current]})
         }

     default:
 			   return state;
 	}
 }
