import { GnroOnAction } from '@gnro/ui/core';
import { createFeature, createReducer, on } from '@ngrx/store';
import { baseOnActions, BaseStoreState, initialState } from '../../base-store';
import { appStoreActions } from './app-store.actions';

export interface AppStoreState extends BaseStoreState {
  total: number; // attibutes not in the base store cannot access from base store, only available to this store.
}

export const initialAppState: AppStoreState = {
  ...initialState,
  total: 0,
};

/*
export const appOnActions: GnroOnAction<AppStoreState>[] = [
  on(appStoreActions.refreshDataSuccess, (state, { data }) => {
    console.log(' data=', data);
    return {
      ...state,
      data,
      total: data.length,
    };
  }),
];*/

export const appOnActions = <AppStoreState>() =>
  [
    on(appStoreActions.refreshDataSuccess, (state, { data }) => {
      console.log(' data=', data);
      return {
        ...state,
        data,
        total: data.length,
      };
    }),
  ] as GnroOnAction<AppStoreState>[];

const allOns = [...baseOnActions, ...appOnActions()] as GnroOnAction<AppStoreState>[];

export const appStoreReducer = createReducer(initialAppState, ...allOns);
// must same as base Store feture name, otherwise cannot access the view use base store
export const appStoreFeature = createFeature({ name: 'baseStore', reducer: appStoreReducer });
