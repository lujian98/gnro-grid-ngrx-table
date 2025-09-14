import { createFeature, createReducer, on } from '@ngrx/store';
import { appBaseStoreActions } from './base-store.actions';
import { GrnoDataType } from '@gnro/ui/core';

export interface BaseStoreState {
  data: GrnoDataType[];
}

export const initialState: BaseStoreState = {
  data: [],
};

export const baseStoreReducer = createReducer(
  initialState,
  on(appBaseStoreActions.loadDataSuccess, (state, { data }) => {
    console.log('base reducer  data=', data);
    return {
      ...state,
      data,
    };
  }),
);

export const appBaseStoreFeature = createFeature({
  name: 'baseStore',
  reducer: baseStoreReducer,
});
