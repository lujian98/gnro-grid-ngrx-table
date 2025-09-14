import { Action, ActionReducer, createFeature, createReducer, on } from '@ngrx/store';
import { baseStoreReducer, BaseStoreState, initialState, mergeReducers, concatReducers } from '../../base-store';
import { appStoreActions } from './app-store.actions';

export interface AppStoreState extends BaseStoreState {
  total: number;
}

export const initialAppState: AppStoreState = {
  ...initialState,
  total: 0,
};

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
]);

export const appStoreFeature = createFeature({
  name: 'baseStore',
  reducer: mergedReducers as ActionReducer<AppStoreState, Action<string>>,
});
