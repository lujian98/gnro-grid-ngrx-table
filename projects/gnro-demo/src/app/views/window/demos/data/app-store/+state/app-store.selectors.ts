import { appStoreFeature } from './app-store.reducer';

//can only have selectBaseStoreState since must use baseStore,
//also cannot access selectTotal or any new attributes not belong to base store.
export const { selectBaseStoreState, selectTotal } = appStoreFeature;

/*
//use this to access select attributes not in the base store if use mergeReducers
export const selectTotal = () =>
  createSelector(selectBaseStoreState, (state: AppStoreState) => (state.total ? state.total : 0));
*/
