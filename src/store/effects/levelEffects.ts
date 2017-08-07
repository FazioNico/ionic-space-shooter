/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
*/

import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { MainActions } from '../actions/mainActions';
import { State } from '../reducers';

@Injectable()
export class LevelEffects {

  constructor(
    private action$: Actions,
    private store$: Store<State>
  ) {}

  @Effect() setLevelAction$ = this.action$
      // Listen for the 'SET_LEVEL' action
      .ofType(MainActions.SET_LEVEL)
      .withLatestFrom(this.store$)
      .switchMap(([payload,state]) => {
        let imgArray:string[] = []
        for (let key in state.level.config) {
          if (state.level.config[key].hasOwnProperty('imgUrl') && state.level.config[key].imgUrl.length >0)
             imgArray = [...imgArray, state.level.config[key].imgUrl]
        }
        return Observable.create((observer) => {
          observer.next({ type: MainActions.IMG_LOAD, payload: imgArray })
        })
      })

      // .map<Action, any>(toPayload)
      // .switchMap((payload:Observable<any>) => {
      //   console.log(this.action$)
      //   return this._http.getLevelIMG(payload)
      // })

  @Effect() updateLevelAction$ = this.action$
      .ofType(MainActions.LEVEL_UPDATE)
      .switchMap(_=>{
       return Observable.create((observer) => {
         observer.next({ type: MainActions.SET_LEVEL, payload: null })
       })
      })
}
