import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroDataType } from '@gnro/ui/core';
import { GnroFormConfig, GnroFormSetting, GnroFormState } from '../models/form.model';
import { defaultFormState } from '../models/default-form';
import { getFormFeatureKey } from './form.reducer';

// Interface for all form selectors
export interface FormSelectors {
  selectFormFeatureState: MemoizedSelector<object, GnroFormState>;
  selectFormConfig: MemoizedSelector<object, GnroFormConfig>;
  selectFormSetting: MemoizedSelector<object, GnroFormSetting>;
  selectFormFieldsConfig: MemoizedSelector<object, GnroFormField[]>;
  selectFormData: MemoizedSelector<object, GnroDataType | undefined>;
}

// Cache for selectors by formName
const formSelectorsByFeature = new Map<string, FormSelectors>();

// Factory function to create per-formName selectors
export function createFormSelectorsForFeature(formName: string): FormSelectors {
  // Return cached selectors if available
  const cached = formSelectorsByFeature.get(formName);
  if (cached) {
    return cached;
  }

  const featureKey = getFormFeatureKey(formName);

  // Feature state selector
  const selectFormFeatureState = createFeatureSelector<GnroFormState>(featureKey);

  const selectFormConfig = createSelector(selectFormFeatureState, (state) =>
    state ? state.formConfig : defaultFormState.formConfig,
  );

  const selectFormSetting = createSelector(selectFormFeatureState, (state) =>
    state ? state.formSetting : defaultFormState.formSetting,
  );

  const selectFormFieldsConfig = createSelector(selectFormFeatureState, (state) => (state ? state.formFields : []));

  const selectFormData = createSelector(selectFormFeatureState, (state) => (state ? state.formData : undefined));

  const selectors: FormSelectors = {
    selectFormFeatureState,
    selectFormConfig,
    selectFormSetting,
    selectFormFieldsConfig,
    selectFormData,
  };

  formSelectorsByFeature.set(formName, selectors);
  return selectors;
}
