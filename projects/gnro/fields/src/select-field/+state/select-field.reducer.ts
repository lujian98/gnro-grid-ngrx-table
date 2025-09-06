import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultSelectFieldState } from '../models/default-select-field';
import { SelectFieldState } from '../models/select-field.model';
import { selectFieldActions } from './select-field.actions';

export const initialState: SelectFieldState = {};

export const gnroSelectFieldFeature = createFeature({
  name: 'gnroSelectField',
  reducer: createReducer(
    initialState,
    on(selectFieldActions.initFieldConfig, (state, action) => {
      const fieldConfig = { ...action.fieldConfig };
      const key = action.fieldId;
      const newState: SelectFieldState = { ...state };
      newState[key] = {
        ...defaultSelectFieldState,
        fieldConfig,
        fieldSetting: {
          ...defaultSelectFieldState.fieldSetting,
          fieldId: action.fieldId,
          viewportReady: !fieldConfig.remoteConfig && !fieldConfig.remoteOptions,
        },
      };
      return { ...newState };
    }),
    on(selectFieldActions.loadFieldConfigSuccess, (state, action) => {
      const fieldConfig = { ...action.fieldConfig };
      const key = action.fieldId;
      const newState: SelectFieldState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          fieldConfig: {
            ...fieldConfig,
          },
          fieldSetting: {
            ...state[key].fieldSetting,
            viewportReady: !fieldConfig.remoteOptions,
          },
        };
      }
      return { ...newState };
    }),
    on(selectFieldActions.loadSelectFieldOptionsSuccess, (state, action) => {
      const key = action.fieldId;
      const newState: SelectFieldState = { ...state };
      if (state[key]) {
        const isObjectOptions = [...action.options].every((item) => typeof item === 'object');
        newState[key] = {
          ...state[key],
          fieldSetting: {
            ...state[key].fieldSetting,
            viewportReady: true,
            singleListOption: !isObjectOptions,
          },
          options: [...action.options] as string[] | object[],
        };
      }
      return { ...newState };
    }),
    on(selectFieldActions.removeSelectFieldStore, (state, action) => {
      const key = action.fieldId;
      const newState: SelectFieldState = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
