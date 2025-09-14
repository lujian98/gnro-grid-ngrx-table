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

console.log(' baseStoreReducer=', baseStoreReducer);
console.log(' appStoreReducer=', appStoreReducer);
const extendedReducer = combineReducers([baseStoreReducer, appStoreReducer]);

export const concatReducers =
  <T, V extends Action = Action>(...reducers: Array<ActionReducer<T>>) =>
  (state: T, action: Action): T =>
    reducers.reduce((accumulatedState, reducer) => reducer(accumulatedState, action), state);

export const concatReducerFactories =
  <T, V extends Action = Action>(...reducerFactories: Array<(state: T, action: Action) => T>) =>
  (state: T, action: Action): T =>
    reducerFactories.reduce((accumulatedState, reducerFactory) => reducerFactory(accumulatedState, action), state);

//const newReducers = concatReducers([baseStoreReducer, appStoreReducer]);

//const newReducers = concatReducerFactories([baseStoreReducer, appStoreReducer]);

console.log(' extendedReducer=', extendedReducer);

function mergeReducers<TState>(...reducers: ActionReducer<TState, Action>[]): ActionReducer<TState, Action> {
  const mergedReducers = (state: TState, action: Action): TState => {
    if (reducers.length === 0) {
      throw new Error('At least one reducer was expected');
    }
    const newState = reducers.reduce((initialState, reducer) => {
      const intermediaryState = reducer(initialState, action);
      return intermediaryState;
    }, state);

    return newState as TState;
  };
  return mergedReducers as ActionReducer<TState, Action>;
}

const concatedReducers = mergeReducers(
  baseStoreReducer as ActionReducer<unknown, Action<string>>,
  appStoreReducer as ActionReducer<unknown, Action<string>>,
);

export const appStoreFeature = createFeature({
  name: 'baseStore',
  reducer: concatedReducers as ActionReducer<AppStoreState, Action<string>>,
});
