/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   08-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 08-08-2017
 */

 import { Injectable } from "@angular/core";
 import { Observable } from 'rxjs';
 import { Action } from '@ngrx/store';
 import { Effect, Actions, toPayload } from "@ngrx/effects";

 import { MainActions } from '../../store/actions/mainActions';
 import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
 import firebase from 'firebase';

 @Injectable()
 export class datasbaseEffects {
   constructor(
     private action$: Actions,
     private _db$: AngularFireDatabase
   ) {
   }

   @Effect() saveData$ = this.action$
       // Listen for the 'SAVE_RECORS' action
       .ofType('SAVE_DATA')
       .map<Action, any>(toPayload)
       .switchMap<Action, any>((payload:any) => {
         //console.log('in saveRecors$ ',payload)
         if(payload.type === 'set'){
           return Observable.fromPromise(
             <Promise<firebase.Promise<any>>>
             this._db$.database.ref(`${payload.collection}/${payload.id||payload.uid}`)
                               .set(payload.datas || {})
                               .then(res => payload.datas )
                               .catch(err => err)
           )
         }
         if(payload.type === 'push'){
           return Observable.fromPromise(
             <Promise<firebase.Promise<any>>>
             this._db$.database.ref(`${payload.collection}${(payload.id||payload.uid)? `/${payload.id||payload.uid}`: ''}`)
                               .push(payload.datas || {})
                               .then(res => payload.datas )
                               .catch(err => err)
           )
         }
         if(!payload.type)  {
           return  Observable.throw('No save methode defined');
         }
       })
       .switchMap(result => {
         return Observable.merge(
           Observable.of<any>({ type: 'SAVE_DATA_SUCCESS', payload: result }),
           Observable.of<any>({ type: 'CLEAN_RECORS', payload: null }),
         )
       })
       .catch(err =>  Observable.of<any>({type: 'SAVE_DATA_FAILED', payload: err}))


   @Effect() saveRecors$ = this.action$
       // Listen for the 'SAVE_RECORS' action
       .ofType('SAVE_MAX_SCORE')
       .map<Action, any>(toPayload)
       .switchMap<Action, FirebaseListObservable<any[]>>((payload:any) => {
         //console.log(payload.datas.current, res.current)
          return this._db$.object(`${payload.collection}/${payload.id||payload.uid}`)
                          .take(1)
                          .switchMap(res=> {
                            console.log(payload.datas.current, res.current)
                            if(!res.current || payload.datas.current > res.current){
                              // update
                              let payload2 = Object.assign({}, payload, {
                                type:'push',
                                collection: 'maxScore',
                                datas: {
                                  score: payload.datas.current,
                                  user: payload.user
                                }
                              });
                              delete payload2.uid;

                              return Observable.merge(
                                Observable.of<any>({type: 'SAVE_DATA', payload: payload}),
                                Observable.of<any>({type: 'SAVE_DATA', payload: payload2})
                              )
                            }
                            else {
                              return  Observable.of<any>({type: 'SAVE_RECORS_FAILED', payload: 'Recors not killed'})
                            }
                          })
       })

   @Effect() getDatasArray$ = this.action$
       // Listen for the 'LOGOUT' action
       .ofType('GET_DATAS_ARRAY')
       .map<Action, any>(toPayload)
       .switchMap<Action, FirebaseListObservable<any[]>>((payload:any) => this._db$.list(payload).take(1))
       .switchMap(res=>  Observable.of<any>({type: 'GET_DATAS_ARRAY_SUCCESS', payload: res}))
       .catch(err => Observable.of<any>({type: 'GET_DATAS_ARRAY_FAILED', payload: err}))


  @Effect() cleanRecors$ = this.action$
      // Listen for the 'LOGOUT' action
      .ofType('CLEAN_RECORS')
      .map<Action, any>(toPayload)
      .switchMap<Action, FirebaseListObservable<any[]>>((payload:any) => {
        //console.log(payload.datas.current, res.current)
         return this._db$.list(`maxScore`)
                         .take(1)
                         .switchMap(res=> {
                           let filtred = res.sort((a,b) => a.score - b.score ).reverse().slice(0, 2);
                           console.log('CLEAN_RECORS->', filtred)
                           this._db$.database.ref(`maxScore`)
                                             .set(filtred);
                           return Observable.of<any>({type: 'CLEAN_RECORS_SUCCESS', payload: null})
                         })
                         .catch(err => Observable.of<any>({type: 'CLEAN_RECORS_FAILED', payload: err}))
      })
 }
