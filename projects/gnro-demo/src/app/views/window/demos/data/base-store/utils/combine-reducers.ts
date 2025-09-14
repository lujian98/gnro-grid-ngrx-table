import { Action, ActionReducer } from '@ngrx/store';

export function mergeReducers<T>(initState: T, reducers: ActionReducer<T, Action>[]): ActionReducer<T, Action> {
  const mergedReducers = (state: T, action: Action): T => {
    if (reducers.length === 0) {
      throw new Error('At least one reducer was expected');
    }
    console.log(' initState=', initState);
    const newState = reducers.reduce((initState, reducer) => {
      const intermediaryState = reducer(initState, action);
      return intermediaryState;
    }, state);

    return newState as T;
  };
  return mergedReducers as ActionReducer<T, Action>;
}

/*

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
