import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  GnroSelectFieldConfig,
  GnroSelectFieldSetting,
  GnroSelectFieldState,
  GnroOptionType,
} from '../models/select-field.model';
import { defaultSelectFieldState } from '../models/default-select-field';
import { getSelectFieldFeatureKey } from './select-field.reducer';

// Selector types for the factory
export interface SelectFieldSelectors {
  selectFieldConfig: MemoizedSelector<object, GnroSelectFieldConfig>;
  selectFieldSetting: MemoizedSelector<object, GnroSelectFieldSetting | undefined>;
  selectOptions: MemoizedSelector<object, GnroOptionType[]>;
}

// Cache for selectors by fieldName
const selectFieldSelectorsByFeature = new Map<string, SelectFieldSelectors>();

// Factory function to create per-fieldName selectors with memoization
export function createSelectFieldSelectorsForFeature(fieldName: string): SelectFieldSelectors {
  // Return cached selectors if available
  const cached = selectFieldSelectorsByFeature.get(fieldName);
  if (cached) {
    return cached;
  }

  const featureKey = getSelectFieldFeatureKey(fieldName);
  const selectSelectFieldFeatureState = createFeatureSelector<GnroSelectFieldState>(featureKey);

  const selectFieldConfig = createSelector(selectSelectFieldFeatureState, (state) => {
    const fieldConfig = state ? state.fieldConfig : undefined;
    return fieldConfig && state.fieldSetting.viewportReady ? fieldConfig : defaultSelectFieldState.fieldConfig;
  });

  const selectFieldSetting = createSelector(selectSelectFieldFeatureState, (state) => {
    const fieldSetting = state ? state.fieldSetting : undefined;
    return fieldSetting && fieldSetting.viewportReady ? fieldSetting : undefined;
  });

  const selectOptions = createSelector(selectSelectFieldFeatureState, (state) => (state ? state.options : []));

  const selectors: SelectFieldSelectors = {
    selectFieldConfig,
    selectFieldSetting,
    selectOptions,
  };

  selectFieldSelectorsByFeature.set(fieldName, selectors);
  return selectors;
}
