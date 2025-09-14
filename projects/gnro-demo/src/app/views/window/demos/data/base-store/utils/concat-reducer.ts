import { Action, ActionReducer } from '@ngrx/store';

export const concatReducers =
  <T, V extends Action = Action>(...reducers: Array<ActionReducer<T>>) =>
  (state: T, action: Action): T =>
    reducers.reduce((accumulatedState, reducer) => reducer(accumulatedState, action), state);

export const concatReducerFactories =
  <T, V extends Action = Action>(...reducerFactories: Array<(state: T, action: Action) => T>) =>
  (state: T, action: Action): T =>
    reducerFactories.reduce((accumulatedState, reducerFactory) => reducerFactory(accumulatedState, action), state);
