/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
*/

import { ActionReducerMap, Action, ActionReducer,  } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromEvents from './eventsReducer';
import * as fromConfig from './configReducer';
import * as fromPlayer from './playerReducer';
import * as fromLevel from './levelReducer';

declare var process:any;

export interface State {
  events: fromEvents.IEventsStats;
  config: fromConfig.IConfigStats;
  player: fromPlayer.IPlayerStats;
  level: fromLevel.ILevelStats;
}

export const REDUCERS: ActionReducerMap<State> = {
  events: fromEvents.reducer,
  player: fromPlayer.reducer,
  level: fromLevel.reducer,
  config: fromConfig.reducer
};

const developmentReducer:ActionReducerMap<State> = REDUCERS //compose(storeFreeze, combineReducers)(REDUCERS);
const productionReducer: ActionReducerMap<State> = REDUCERS;

export const reducer:ActionReducerMap<State> = process.env.IONIC_ENV === 'prod' ? productionReducer :  developmentReducer;
