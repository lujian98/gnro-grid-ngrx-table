import { concatReducers } from '@gnro/ui/core';
import { Action, ActionReducer, createFeature, createReducer, on, ActionCreator } from '@ngrx/store';
import { baseStoreReducer, BaseStoreState, initialState, baseOnActions } from '../../base-store';
import { appStoreActions } from './app-store.actions';

export interface AppStoreState extends BaseStoreState {
  total: number; // attibutes not in the base store cannot access from base store, only available to this store.
}

export const initialAppState: AppStoreState = {
  ...initialState,
  total: 0,
};

/*
export const appStoreReducer = createReducer(
  initialAppState,
  on(appStoreActions.refreshDataSuccess, (state, { data }) => {
    return {
      ...state,
      data,
      total: data.length,
    };
  }),
); 

const mergedReducers = concatReducers([
  baseStoreReducer as ActionReducer<unknown, Action<string>>,
  appStoreReducer as ActionReducer<unknown, Action<string>>,
]) as ActionReducer<AppStoreState, Action<string>>;

export const appStoreFeature = createFeature({
  name: 'baseStore', //must use 'baseStore` to access base store reducer data
  reducer: mergedReducers,
});
*/

export const appOnActions: ReturnType<typeof on<AppStoreState, readonly ActionCreator[]>>[] = [
  on(appStoreActions.refreshDataSuccess, (state, { data }) => {
    return {
      ...state,
      data,
      total: data.length,
    };
  }),
];

const allOns = [...baseOnActions, ...appOnActions] as ReturnType<typeof on<AppStoreState, readonly ActionCreator[]>>[];

export const appStoreReducer = createReducer(initialAppState, ...allOns);

export const appStoreFeature = createFeature({
  name: 'baseStore',
  reducer: appStoreReducer,
});
