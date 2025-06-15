import { createSelector } from '@ngrx/store';
import { FormState } from '../models/form.model';
import { defaultFormState } from '../models/default-form';

export interface AppFormState {
  gnroForm: FormState;
}

export const featureSelector = (state: AppFormState) => state.gnroForm;

export const selectFormSetting = (formId: string) =>
  createSelector(featureSelector, (state: FormState) => {
    return state && state[formId] ? state[formId].formSetting : defaultFormState.formSetting;
  });

export const selectFormConfig = (formId: string) =>
  createSelector(featureSelector, (state: FormState) => {
    return state && state[formId] ? state[formId].formConfig : defaultFormState.formConfig;
  });

export const selectFormFieldsConfig = (formId: string) =>
  createSelector(featureSelector, (state: FormState) => {
    return state && state[formId] ? state[formId].formFields : [];
  });

export const selectFormData = (formId: string) =>
  createSelector(featureSelector, (state: FormState) => {
    return state && state[formId] ? state[formId].formData : [];
  });
