import { Action, ActionReducer, createFeature, createReducer, on } from '@ngrx/store';
import { baseStoreReducer, initialState, BaseStoreState } from '../../base-store';
import { appStoreActions } from './app-store.actions';

export interface AppStoreState extends BaseStoreState {
  total: number;
}

export const initialAppState: AppStoreState = {
  ...initialState,
  total: 0,
};

export const appStoreReducer = createReducer(
  initialAppState,
  on(appStoreActions.refreshDataSuccess, (state, { data }) => {
    return {
      ...state,
      data,
      total: data.length,
    };
  }),
);

function combineReducers(
  reducers: (ActionReducer<BaseStoreState, Action> | ActionReducer<AppStoreState, Action>)[],
): ActionReducer<AppStoreState, Action> {
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
