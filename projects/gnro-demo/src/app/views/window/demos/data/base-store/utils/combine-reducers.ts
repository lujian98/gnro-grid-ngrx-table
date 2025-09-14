import { Action, ActionReducer } from '@ngrx/store';

export function mergeReducers<TState>(
  initState: TState,
  reducers: ActionReducer<TState, Action>[],
): ActionReducer<TState, Action> {
  const mergedReducers = (state: TState, action: Action): TState => {
    if (reducers.length === 0) {
      throw new Error('At least one reducer was expected');
    }
    console.log(' initState=', initState);
    const newState = reducers.reduce((initState, reducer) => {
      const intermediaryState = reducer(initState, action);
      return intermediaryState;
    }, state);

    return newState as TState;
  };
  return mergedReducers as ActionReducer<TState, Action>;
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
