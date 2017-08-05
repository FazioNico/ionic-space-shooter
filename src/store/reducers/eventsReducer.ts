/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   25-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 26-07-2017
 */

import { Action } from '@ngrx/store';
import { MainActions } from '../actions/mainActions';

export interface IEventsStats extends Object{
  mousemove?:any;
  click?: Event;
  key?:Event;
}

export const intitialState:IEventsStats = {}

export function reducer (state:IEventsStats = intitialState, action:any):IEventsStats {
  switch (action.type) {
    case MainActions.INIT:
         return Object.assign({}, state, intitialState)
		case MainActions.MOUSE_MOVE:
        return Object.assign({}, state, { mousemove: action.payload })
    case MainActions.KEY_PRESS:
        return Object.assign({}, state, { key: action.payload })

		default:
			return state;
	}
}
