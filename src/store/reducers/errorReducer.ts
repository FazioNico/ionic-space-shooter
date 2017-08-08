/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   07-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
 */

 import { Action } from "@ngrx/store";
  import { MainActions } from '../actions/mainActions';

  export interface IErrorState extends String {};

  export let intitialState:IErrorState = null

  export function reducer (state:IErrorState = intitialState, action:any):IErrorState {
      //console.log('ERROR REDUCER-> ', action);
      switch (action.type) {
        case MainActions.CHECK_AUTH_FAILED:
        case MainActions.LOGIN_FAILED:
        case MainActions.LOGOUT_FAILED:
        case 'OPEN_MODAL_FAILED':
        case 'SIGNUP_FAILED': {
          return <IErrorState>action.payload
        }
        case MainActions.ERROR_CLEAN: {
          return  <IErrorState>intitialState // use this to clean error state
        }
        default: {
          return <IErrorState>state  || intitialState // to not remove old error on state change
        }
      }
  };
