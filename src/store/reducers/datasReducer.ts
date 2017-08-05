/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   27-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 27-07-2017
 */

//
//
//   import { Action } from "@ngrx/store";
//   import { MainActions } from '../actions/mainActions';
//   import { ITodo } from '../../services/datas-service/datas.service';
//
//   export interface IDatasState extends Array<ITodo>{}
//
//   export const intitialState:IDatasState = []
//
//   export function reducer (state:IDatasState = intitialState, action:Action):IDatasState {
//       //console.log('ARRAY DATAS REDUCER-> ', action);
//       switch (action.type) {
//         case MainActions.GET_DATAS: {
//           return Object.assign([], state)
//         }
//         case MainActions.GET_DATAS_SUCCESS: {
//           return Object.assign([], [...action.payload])
//         }
//
//         default: {
//           return <IDatasState>state;
//         }
//       }
//   };
