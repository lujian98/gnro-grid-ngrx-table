import { createSelector } from '@ngrx/store';
import { BaseReducerManagerState } from './base-reducer-manager.reducer';

export interface FeatureReducerManagerState {
  [key: string]: BaseReducerManagerState;
}

export const featureSelector = (featureName: string) => (state: FeatureReducerManagerState) => state[featureName];

export const selectConfig = (featureName: string) =>
  createSelector(featureSelector(featureName), (state: BaseReducerManagerState) => state.config);

export const selectData = (featureName: string) =>
  createSelector(featureSelector(featureName), (state: BaseReducerManagerState) => state.data);
