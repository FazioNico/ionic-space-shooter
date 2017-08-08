/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 08-08-2017
*/

import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
// Import ngrx Tools
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { storeFreeze } from 'ngrx-store-freeze';
// Import ngRx Store App
import { reducer } from './reducers';
import { EventsEffects } from './effects/eventsEffects';
import { LevelEffects } from './effects/levelEffects';
import { authEffects } from './effects/authEffects';
import { datasbaseEffects } from './effects/databaseEffects';
import { MainActions } from './actions/mainActions';
import { HttpService } from "./services/http-service";

// AngularFire2
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FB_CONFIG } from "./store.config";

// Define const
const providers:Array<any> =  [
  MainActions,
  HttpService
];
const effects:Array<any> = [
  EventsEffects,
  LevelEffects,
  authEffects,
  datasbaseEffects
];
const actions:Array<any> = [
  MainActions
];

@NgModule({
  imports: [
    HttpModule,
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducer,  {
      metaReducers: [storeFreeze]
    }),
    StoreDevtoolsModule.instrument(),
    AngularFireModule.initializeApp(FB_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  declarations: [],
  providers: [...providers, ...effects, ...actions]
})
export class AppStateModule { }
