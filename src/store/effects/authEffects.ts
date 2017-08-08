/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   07-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
 */


 import { Injectable } from "@angular/core";
 import { Observable } from 'rxjs';
 import { Action } from '@ngrx/store';
 import { Effect, Actions, toPayload } from "@ngrx/effects";

 import { MainActions } from '../../store/actions/mainActions';
 import { AngularFireAuth} from 'angularfire2/auth';
 import firebase from 'firebase';

 @Injectable()
 export class authEffects {
   constructor(
     private action$: Actions,
     private _auth$: AngularFireAuth,
   ) {
   }

   @Effect() checkAuth$ = this.action$
       // Listen for the 'CHECK_AUTH' action
       .ofType(MainActions.CHECK_AUTH)
       .flatMap<Action, firebase.User>(() => this._auth$.authState)
       .switchMap<firebase.User, Action>((_result:firebase.User) => {
           //console.log('in checkAuth$',_result)
           if (_result) {
               return Observable.of(<Action>{ type: MainActions.CHECK_AUTH_SUCCESS, payload: Object.assign({}, {email:_result.email, id:_result.uid}) })
           } else {
               console.log('CHECK_AUTH_NO_USER',_result)
               // Observable.of(<Action>{ type: 'OPEN_MODAL', payload: 'SignInModal' })
               return Observable.of(<Action>{ type: MainActions.CHECK_AUTH_NO_USER, payload: null })
           }
       })
       .catch((res: any) => Observable.of({ type: MainActions.CHECK_AUTH_FAILED, payload: res }))

     @Effect() logout$ = this.action$
         // Listen for the 'LOGOUT' action
         .ofType(MainActions.LOGOUT)
         .switchMap<Action, firebase.Promise<any>>(() => this._auth$.auth.signOut())
         .switchMap(_=>  Observable.of<any>({type: MainActions.LOGOUT_SUCCESS, payload: null}))
         .catch(err => {
           return  Observable.of<any>({type: MainActions.LOGOUT_FAILED, payload: err})
         })

     @Effect() login$ = this.action$
         // Listen for the 'LOGIN' action
         .ofType(MainActions.LOGIN)
         .map<Action, any>(toPayload)
         .switchMap((payload:{email:string,password:string}) => {
           //console.log("in login$", payload)
           return Observable.fromPromise(<Promise<firebase.Promise<any>>>this._auth$.auth.signInWithEmailAndPassword(payload.email, payload.password))
         })
         .switchMap((payload:any) => {
           return  Observable.of<any>({type: MainActions.LOGIN_SUCCESS, payload: Object.assign({}, {email:payload.email, id:payload.uid})})
         })
         .catch(err => {
           return  Observable.of<any>({type: MainActions.LOGIN_FAILED, payload: err})
         })

     @Effect() signup$ = this.action$
         // Listen for the 'SIGNUP' action
         .ofType(MainActions.CREATE_USER)
         .map<Action, any>(toPayload)
         .switchMap((payload:{email:string,password:string}) => {
             //console.log("in signup$", payload)
             return Observable.fromPromise(<Promise<firebase.Promise<any>>>this._auth$.auth.createUserWithEmailAndPassword(payload.email, payload.password))
         })
         .switchMap((payload:any) => {
             return  Observable.of<any>({type: 'SIGNUP_SUCCESS', payload: Object.assign({}, {email:payload.email})})
         })
         .catch(err => {
           return  Observable.of<any>({type: 'SIGNUP_FAILED', payload: err})
         })

     @Effect() openModal$ = this.action$
         // Listen for the 'OPEN_MODAL' action
         .ofType('OPEN_MODAL')
         .map<Action, any>(toPayload)
         .switchMap((payload:Observable<any>) => {
             //console.log("in openModal$", payload)
             return Observable.of<any>({type: 'OPEN_MODAL_SUCCESS', payload})
         })
 }
