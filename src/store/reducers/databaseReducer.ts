/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   08-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 08-08-2017
 */

 import { Action } from "@ngrx/store";
 import { MainActions } from '../actions/mainActions';

 export interface IDatabaseState extends Array<{maxScore:string, user:{id:string, email:string}}>{
 }

 export let intitialState:IDatabaseState = []

 export function reducer (state:IDatabaseState = intitialState, action:any):IDatabaseState {
     // console.log('RECORS REDUCER-> ', action);
     switch (action.type) {
       case 'GET_DATAS_ARRAY': {
         return Object.assign([], state)
       }
       case 'GET_DATAS_ARRAY_SUCCESS': {
       return Object.assign([], [...action.payload])
     }  
       default: {
         return <IDatabaseState>state;
       }
     }
 };
