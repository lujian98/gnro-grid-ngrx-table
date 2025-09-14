import { Action, ActionReducer, createFeature, createReducer, on } from '@ngrx/store';
import { baseStoreReducer, initialState } from '../../base-store';
import { appStoreActions } from './app-store.actions';

export const appStoreReducer = createReducer(
  initialState,
  on(appStoreActions.refreshDataSuccess, (state, { data }) => {
    return {
      ...state,
      data,
    };
  }),
);

function combineReducers(reducers: ActionReducer<any, Action>[]): ActionReducer<any, Action> {
  return (state: any, action: Action) => {
    return reducers.reduce((accumulator, currentReducer) => {
      return currentReducer(accumulator, action);
    }, state);
  };
}

const extendedReducer = combineReducers([baseStoreReducer, appStoreReducer]);

export const appStoreFeature = createFeature({
  name: 'baseStore',
  reducer: extendedReducer,
});
