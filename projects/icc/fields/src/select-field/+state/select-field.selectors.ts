import { createSelector } from '@ngrx/store';
import { SelectFieldState } from '../models/select-field.model';
import { defaultSelectFieldState } from '../models/default-select-field';

export interface AppSelectState {
  iccSelectField: SelectFieldState;
}

export const featureSelector = (state: AppSelectState) => state.iccSelectField;

export const selectFieldSetting = (fieldId: string) =>
  createSelector(featureSelector, (state: SelectFieldState) => {
    const fieldSetting = state && state[fieldId] ? state[fieldId].fieldSetting : undefined;
    return fieldSetting && fieldSetting.viewportReady ? fieldSetting : defaultSelectFieldState.fieldSetting;
  });

export const selectFieldConfig = (fieldId: string) =>
  createSelector(featureSelector, (state: SelectFieldState) => {
    const fieldConfig = state && state[fieldId] ? state[fieldId].fieldConfig : undefined;
    return fieldConfig && state[fieldId].fieldSetting.viewportReady ? fieldConfig : defaultSelectFieldState.fieldConfig;
  });

export const selectOptions = (fieldId: string) =>
  createSelector(featureSelector, (state: SelectFieldState) => {
    return state && state[fieldId] ? state[fieldId].options : [];
  });
