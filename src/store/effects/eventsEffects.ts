/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 04-08-2017
*/

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/fromEvent';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/pluck';

import { MainActions } from '../actions/mainActions';
import { HttpService } from "../services/http-service";

@Injectable()
export class EventsEffects {

  constructor(
    private action$: Actions,
    private _http: HttpService
  ) {}

  @Effect() initMouseMove$:Observable<Action> = this.action$
      // Listen for the 'MOUSEMOVE' action
      .ofType(MainActions.MOUSE_MOVE)
      .map<Action, any>(toPayload)
      .switchMap((payload:Observable<MouseEvent>) => {
        return Observable.fromEvent<MouseEvent>(document, 'mousemove')
                         //.sampleTime(1000/120)
                         .throttleTime(1000/120)
      })
      .map((event:MouseEvent) =>{
       return  { type: MainActions.MOUSE_MOVING, payload: {x:event.clientX, y:event.clientY} }
      })


  @Effect() initKeyPress$:Observable<Action> = this.action$
      // Listen for the 'KEY_PRESS' action
      .ofType(MainActions.KEY_PRESS)
      .map<Action, any>(toPayload)
      .switchMap((payload:Observable<KeyboardEvent>) => {
        return Observable.fromEvent<KeyboardEvent>(document, 'keypress')
      })
      .debounce((event) => Observable.interval(1000/3))
      .pluck('keyCode')
      .map((keyCode:number) =>{
       return  { type: MainActions.KEY_PRESS, payload: {keyCode:keyCode, time:Date.now()} }
      })

  @Effect() loadImage$:Observable<Action> = this.action$
      .ofType(MainActions.IMG_LOAD)
      .map<Action, any>(toPayload)
      .switchMap((payload:Observable<any>)=>{
        return Observable.from(payload)
      })
      .concatMap(url=> {
        //console.log(url)
        return Observable.create((observer)=>{
           let img = new Image();
           img.src = url;
           img.onload = ()=>{
             //console.log('onload')
             observer.next({ type: MainActions.IMG_LOAD_SUCCESS, payload: img.src});
             observer.complete()
           }
           img.onerror = (err)=>{
             observer.onError(err);
           }
         })
      })


  @Effect() loadAction$ = this.action$
      // Listen for the 'GET_DATAS' action
      .ofType(MainActions.GET_DATAS)
      .map<Action, any>(toPayload)
      .switchMap((payload:Observable<any>) => {
        return this._http.getDatas(payload)
      })
}
