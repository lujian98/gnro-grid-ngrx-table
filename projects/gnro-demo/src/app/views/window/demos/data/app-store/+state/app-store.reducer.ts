import { createFeature, ActionReducerMap, createReducer, on, Action, combineReducers } from '@ngrx/store';
import { appStoreActions } from './app-store.actions';
import { GrnoDataType } from '@gnro/ui/core';
import { BaseStoreState, initialState, baseStoreReducer } from '../../base-store';

export const appStoreReducer = createReducer(
  initialState,
  /*
  on(appBaseStoreActions.loadDataSuccess, (state, { data }) => {
    console.log('reducer  data=', data);
    return {
      ...state,
      data,
    };
  }),*/
);

/*
export function combinedReducer(state: BaseStoreState | undefined, action: any) {
  const baseState = baseStoreReducer(state, action); // Apply base reducer first
  return createReducer(
    baseState, // Use the state from the base reducer as the starting point
    //on(setMessage, (s, { newMessage }) => ({ ...s, message: newMessage }))
  )(baseState, action); // Apply custom reducer to the base state
}
*/

/*
const reducer = combineReducers(baseStoreReducer, appStoreReducer);
*/

export const reducers = combineReducers({
  baseStore: baseStoreReducer,
  appStore: appStoreReducer,
});

export const appStoreFeature = createFeature({
  name: 'appStore',
  reducer: reducers,
});

/*
function appReducerFactory(state: BaseStoreState, action: Action) {
  return appStoreReducer(state, action);
}

function initialAppReducerFactory(state: BaseStoreState, action: Action) {
  return baseStoreReducer(state, action);
}

export const reducer = concatReducers(baseStoreReducer, appStoreReducer);

// Factory is needed If you are using AOT builds with ViewEngine
export function reducerFactory(state: BaseStoreState, action: Action) {
  return concatReducerFactories(initialAppReducerFactory, appReducerFactory)(state, action);
}
export interface AppStoreFeature {
  baseStore: BaseStoreState;
  appStore: BaseStoreState;
}

export const featureReducer = combineReducers<AppStoreFeature>({
  baseStore: baseStoreReducer,
  appStore: appStoreReducer,
});


export const appStoreFeature = createFeature({
  name: 'appStore',
  reducer: featureReducer,
});
*/
