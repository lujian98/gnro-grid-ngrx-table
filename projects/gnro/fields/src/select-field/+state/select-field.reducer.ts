import { Action, createReducer, on } from '@ngrx/store';
import { defaultSelectFieldState } from '../models/default-select-field';
import { GnroSelectFieldState } from '../models/select-field.model';
import { selectFieldActions } from './select-field.actions';

// Feature key generator for per-fieldName feature slices
export function getSelectFieldFeatureKey(fieldName: string): string {
  return `selectField_${fieldName}`;
}

// Initial state factory for per-fieldName state
export function getInitialSelectFieldState(fieldName: string): GnroSelectFieldState {
  return {
    ...defaultSelectFieldState,
    fieldConfig: {
      ...defaultSelectFieldState.fieldConfig,
      fieldName,
    },
    fieldSetting: {
      ...defaultSelectFieldState.fieldSetting,
    },
  };
}

// Cache for reducers by fieldName
const selectFieldReducersByFeature = new Map<
  string,
  (state: GnroSelectFieldState | undefined, action: Action) => GnroSelectFieldState
>();

// Factory function to create per-fieldName reducers
export function createSelectFieldReducerForFeature(fieldName: string) {
  // Return cached reducer if available
  const cached = selectFieldReducersByFeature.get(fieldName);
  if (cached) {
    return cached;
  }

  const initialState = getInitialSelectFieldState(fieldName);

  const selectFieldReducer = createReducer(
    initialState,
    on(selectFieldActions.initConfig, (state, action) => {
      if (action.fieldName !== fieldName) return state;
      const fieldConfig = { ...action.fieldConfig };
      // Always start from fresh initial state to avoid stale data
      const freshState = getInitialSelectFieldState(fieldName);
      return {
        ...freshState,
        fieldConfig,
        fieldSetting: {
          ...freshState.fieldSetting,
          viewportReady: !fieldConfig.remoteConfig && !fieldConfig.remoteOptions,
        },
      };
    }),
    on(selectFieldActions.loadConfigSuccess, (state, action) => {
      if (action.fieldName !== fieldName) return state;
      const fieldConfig = { ...action.fieldConfig };
      return {
        ...state,
        fieldConfig: {
          ...fieldConfig,
        },
        fieldSetting: {
          ...state.fieldSetting,
          viewportReady: !fieldConfig.remoteOptions,
        },
      };
    }),
    on(selectFieldActions.loadOptionsSuccess, (state, action) => {
      if (action.fieldName !== fieldName) return state;
      const isObjectOptions = [...action.options].every((item) => typeof item === 'object');
      return {
        ...state,
        fieldSetting: {
          ...state.fieldSetting,
          viewportReady: true,
          singleListOption: !isObjectOptions,
        },
        options: [...action.options] as string[] | object[],
      };
    }),
    on(selectFieldActions.removeStore, (state, action) => {
      if (action.fieldName !== fieldName) return state;
      return getInitialSelectFieldState(fieldName);
    }),
  );

  const reducerFn = (state: GnroSelectFieldState | undefined, action: Action): GnroSelectFieldState => {
    return selectFieldReducer(state, action);
  };

  selectFieldReducersByFeature.set(fieldName, reducerFn);
  return reducerFn;
}
