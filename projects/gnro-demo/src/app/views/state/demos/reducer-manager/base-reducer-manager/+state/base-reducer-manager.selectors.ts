import { createSelector } from '@ngrx/store';
import { BaseReducerManagerState } from './base-reducer-manager.reducer';

export interface FeatureReducerManagerState {
  [key: string]: BaseReducerManagerState;
}

export const selectData = (featureName: string) =>
  createSelector(
    (state: FeatureReducerManagerState) => state[featureName],
    (state: BaseReducerManagerState) => state.data,
  );
