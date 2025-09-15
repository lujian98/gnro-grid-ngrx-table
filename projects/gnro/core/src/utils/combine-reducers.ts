import { Action, ActionReducer } from '@ngrx/store';

export const concatReducers =
  <T>(reducers: ActionReducer<T, Action>[]) =>
  (state: T, action: Action): T =>
    reducers.reduce((accumulate, reducer) => reducer(accumulate, action), state);

export function mergeReducers<T>(reducers: ActionReducer<T, Action>[]): ActionReducer<T, Action> {
  return ((state: T, action: Action): T =>
    reducers.reduce((accumulate, reducer) => reducer(accumulate, action), state)) as ActionReducer<T, Action>;
}

/*


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

const mergedReducers = concatReducers([
  baseStoreReducer as ActionReducer<unknown, Action<string>>,
  appStoreReducer as ActionReducer<unknown, Action<string>>,
]) as ActionReducer<AppStoreState, Action<string>>;

export const appStoreFeature = createFeature({
  name: 'baseStore', //must use 'baseStore` to access base store reducer data
  reducer: mergedReducers,
});


export const concatReducers =
  <T, V extends Action = Action>(...reducers: Array<ActionReducer<T>>) =>
  (state: T, action: Action): T =>
    reducers.reduce((accumulatedState, reducer) => reducer(accumulatedState, action), state);

export const concatReducerFactories =
  <T, V extends Action = Action>(...reducerFactories: Array<(state: T, action: Action) => T>) =>
  (state: T, action: Action): T =>
    reducerFactories.reduce((accumulatedState, reducerFactory) => reducerFactory(accumulatedState, action), state);


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
*/
