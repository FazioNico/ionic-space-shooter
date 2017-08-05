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

 export interface ISatatusStats extends Object{
    audio:boolean;
    player:boolean;
    level:boolean;
    imgs:boolean;
 }

 export const intitialState:ISatatusStats = {
    audio:false,
    player:false,
    level:false,
    imgs:false
 }

 export function reducer (state:ISatatusStats = intitialState, action:any):ISatatusStats {
   switch (action.type) {
    case MainActions.INIT:
        return Object.assign({}, state,intitialState)
    // case MainActions.PLAYER_UPDATE:
    //     if(action.payload.imgUrl) return Object.assign({}, state, {imgs:true})
    //     return state
    case MainActions.GET_DATAS_SUCCESS:
        //console.log(Object.assign({}, state, {player:true}))
        if(action.payload.item === 'player' && action.payload.datas.life) return Object.assign({}, state, {player:true})
        return state
    // case MainActions.CONFIG_UPDATE:
    //      return Object.assign({}, state, action.payload)

    default:
 			  return state;
 	}
 }
