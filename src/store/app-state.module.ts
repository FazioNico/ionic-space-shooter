/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 27-07-2017
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
import { MainActions } from './actions/mainActions';
import { HttpService } from "./services/http-service";
// Define const
const providers:Array<any> =  [
  MainActions,
  HttpService
];
const effects:Array<any> = [
  EventsEffects
];
const actions:Array<any> = [
  MainActions
];

@NgModule({
  imports: [
    HttpModule,
    EffectsModule.forRoot([EventsEffects]),
    StoreModule.forRoot(reducer,  {
      metaReducers: [storeFreeze]
    }),
    StoreDevtoolsModule.instrument()
  ],
  declarations: [],
  providers: [...providers, ...effects, ...actions]
})
export class AppStateModule { }
