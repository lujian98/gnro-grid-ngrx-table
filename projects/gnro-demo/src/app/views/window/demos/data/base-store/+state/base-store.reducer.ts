import { GnroOnAction, GnroDataType } from '@gnro/ui/core';
import { createFeature, createReducer, on } from '@ngrx/store';
import { appBaseStoreActions } from './base-store.actions';

export interface BaseStoreState {
  data: GnroDataType[];
}

export const initialState: BaseStoreState = {
  data: [],
};

export const baseOnActions: GnroOnAction<BaseStoreState>[] = [
  on(appBaseStoreActions.loadDataSuccess, (state, { data }) => {
    return {
      ...state,
      data,
    };
  }),
];

export const baseStoreReducer = createReducer(initialState, ...baseOnActions);

export const appBaseStoreFeature = createFeature({
  name: 'baseStore',
  reducer: baseStoreReducer,
});
