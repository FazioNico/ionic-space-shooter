/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
*/


import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

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



  static ERROR_CLEAN:string = 'ERROR_CLEAN';
  errorClean(){
    return <Action>{
      type: MainActions.ERROR_CLEAN,
      payload: null
    }
  }

  // Auth Actions
  static CHECK_AUTH:string = 'CHECK_AUTH';
  checkAuth(): Action {
    return <Action>{
      type: MainActions.CHECK_AUTH,
    }
  }
  static CHECK_AUTH_SUCCESS:string = 'CHECK_AUTH_SUCCESS';
  static CHECK_AUTH_FAILED:string = "CHECK_AUTH_FAILED";
  static CHECK_AUTH_NO_USER:string = 'CHECK_AUTH_NO_USER';

  static LOGIN:string = "LOGIN";
  login(_credentials ): Action {
    return <Action>{
      type: MainActions.LOGIN,
      payload: _credentials.value
    }
  }
  static LOGIN_SUCCESS:string = "LOGIN_SUCCESS";
  static LOGIN_FAILED:string = "LOGIN_FAILED";
  static LOGOUT:string = "LOGOUT";
  logout(): Action {
    return <Action>{
      type: MainActions.LOGOUT,
    }
  }
  static LOGOUT_SUCCESS:string = "LOGOUT_SUCCESS";
  static LOGOUT_FAILED:string = "LOGOUT_FAILED"

  static CREATE_USER:string = "CREATE_USER";
  create_user(_credentials ): Action {
    return <Action>{
      type: MainActions.CREATE_USER,
      payload: _credentials.value
    }
  }
  static CREATE_USER_SUCCESS:string = "CREATE_USER_SUCCESS";
  static CREATE_USER_FAILED:string = "CREATE_USER_FAILED"

}
