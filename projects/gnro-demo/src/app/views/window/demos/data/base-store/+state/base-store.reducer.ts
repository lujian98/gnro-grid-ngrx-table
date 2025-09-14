import { GrnoDataType } from '@gnro/ui/core';
import { createFeature, createReducer, on, ActionCreator } from '@ngrx/store';
import { appBaseStoreActions } from './base-store.actions';

export interface BaseStoreState {
  data: GrnoDataType[];
}

export const initialState: BaseStoreState = {
  data: [],
};

/*
export const baseStoreReducer = createReducer(
  initialState,
  on(appBaseStoreActions.loadDataSuccess, (state, { data }) => {
    return {
      ...state,
      data,
    };
  }),
);

export const appBaseStoreFeature2 = createFeature({
  name: 'baseStore',
  reducer: baseStoreReducer,
});
*/

export const baseOnActions: ReturnType<typeof on<BaseStoreState, readonly ActionCreator[]>>[] = [
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
