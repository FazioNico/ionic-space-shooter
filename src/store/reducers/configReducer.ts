/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   25-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 09-08-2017
 */

 import { Action } from '@ngrx/store';
 import { MainActions } from '../actions/mainActions';

 import { LEVELS, ILevels, ILevel } from "../../game-config/levels/levels";

 export interface IConfigStats extends Object{
    position:{
      x:number,
      y:number,
      width:number,
      height:number,
      platform:boolean
    },
    imgDatas?:string[]
 }

 export const intitialState:IConfigStats = {
    position:{
      x:0,
      y:0,
      width:800,
      height:600,
      platform:true
    },
    imgDatas: []
 }

 export function reducer (state:IConfigStats = intitialState, action:any):IConfigStats {
   switch (action.type) {
    case MainActions.INIT:
         return Object.assign({}, state,intitialState)
    case MainActions.CONFIG_UPDATE:
         return Object.assign({}, state, {
            [action.payload.item]:Object.assign(
              {},
              state[action.payload.item],
              action.payload.datas
            )
         })

    case MainActions.IMG_LOAD_SUCCESS:
         return Object.assign({}, state, {
           imgDatas: [
             ...state.imgDatas,
             action.payload
           ]
         })

    case MainActions.IMG_INIT:
          return Object.assign({}, state, {imgDatas: []})
          
    //  case MainActions.GET_DATAS_SUCCESS: {
    //      return Object.assign({}, state, {
    //       elements: {
    //         [action.payload.item]:Object.assign(
    //           {},
    //           state.elements[action.payload.item],
    //           action.payload.datas
    //         )
    //       }
    //      })
    //  }


    //  case MainActions.MOUSE_MOVING:{
    //       // console.log(action.payload)
    //       return Object.assign({}, state, {
    //        elements: {
    //          player: Object.assign(
    //            {},
    //            state.elements.player,
    //            action.payload)
    //          }
    //        })
    //  }

     default:
 			   return state;
 	}
 }
