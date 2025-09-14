import { GrnoDataType } from '@gnro/ui/core';
import { createFeature, createReducer, on } from '@ngrx/store';
import { appBaseStoreActions } from './base-store.actions';

export interface BaseStoreState {
  data: GrnoDataType[];
}

export const initialState: BaseStoreState = {
  data: [],
};

export const baseStoreReducer = createReducer(
  initialState,
  on(appBaseStoreActions.loadDataSuccess, (state, { data }) => {
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
