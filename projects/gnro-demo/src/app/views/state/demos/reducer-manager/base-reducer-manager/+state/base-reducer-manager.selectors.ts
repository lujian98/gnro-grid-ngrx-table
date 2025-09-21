import { createSelector } from '@ngrx/store';
import { BaseReducerManagerState } from './base-reducer-manager.reducer';

export interface AppBaseReducerManagerState {
  [key: string]: BaseReducerManagerState;
}

export const selectData = (featureName: string) =>
  createSelector(
    (state: AppBaseReducerManagerState) => state[featureName],
    (state: BaseReducerManagerState) => state.data,
  );
