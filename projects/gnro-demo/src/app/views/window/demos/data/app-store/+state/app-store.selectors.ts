import { createSelector } from '@ngrx/store';
import { appStoreFeature, AppStoreState } from './app-store.reducer';

export const { selectBaseStoreState } = appStoreFeature;

export const selectTotal = () =>
  createSelector(selectBaseStoreState, (state: AppStoreState) => (state.total ? state.total : 0));
