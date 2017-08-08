/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   07-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
 */

  import { Action } from "@ngrx/store";
  import { MainActions } from '../actions/mainActions';

  export interface IAuthState extends Object {
    id:string,
    email:string
  };

  export let intitialState:IAuthState = null

  export function reducer (state:IAuthState = intitialState, action:any):IAuthState {
      // console.log('AUTH REDUCER-> ', action);
      switch (action.type) {
        case MainActions.LOGIN: {
          return Object.assign({}, state)
        }
        case MainActions.CHECK_AUTH_SUCCESS: {
          return Object.assign({}, state, action.payload)
        }
        case MainActions.LOGOUT_SUCCESS:  {
          return <IAuthState>intitialState;
        }
        default: {
          return <IAuthState>state;
        }
      }
 }
