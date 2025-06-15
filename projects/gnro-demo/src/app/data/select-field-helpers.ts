import { IccSelectFieldConfig } from '@icc/ui/fields';

export const SingleSelectConfig: Partial<IccSelectFieldConfig> = {
  fieldLabel: 'Single Selection (Object)',
  optionLabel: 'state',
  optionKey: 'abbr',
  placeholder: 'Select One...',
};

export const MultiSelectConfig: Partial<IccSelectFieldConfig> = {
  multiSelection: true,
  fieldLabel: 'Multi Selection (Object)',
  optionLabel: 'state',
  optionKey: 'abbr',
  placeholder: 'Select One or More...',
};

export const SingleAutocompleteConfig: Partial<IccSelectFieldConfig> = {
  selectOnly: false,
  fieldLabel: 'Single Autocomplete (Object)',
  optionLabel: 'state',
  optionKey: 'abbr',
  placeholder: 'Select One...',
};

export const MultiAutocompleteConfig: Partial<IccSelectFieldConfig> = {
  multiSelection: true,
  selectOnly: false,
  fieldLabel: 'Multi Autocomplete (Object)',
  optionLabel: 'state',
  optionKey: 'abbr',
  placeholder: 'Select One or More...',
};

export const SingleListConfig: Partial<IccSelectFieldConfig> = {
  fieldLabel: 'Single Selection (List)',
  placeholder: 'Select One...',
};

export const MultiListConfig: Partial<IccSelectFieldConfig> = {
  multiSelection: true,
  fieldLabel: 'Multi Selection (List)',
  placeholder: 'Select One or More...',
};

export const SingleAutocompleteLisConfig: Partial<IccSelectFieldConfig> = {
  selectOnly: false,
  fieldLabel: 'Single Autocomplete (List)',
  placeholder: 'Select One...',
};

export const MultiAutocompleteListConfig: Partial<IccSelectFieldConfig> = {
  multiSelection: true,
  selectOnly: false,
  fieldLabel: 'Multi Autocomplete (List)',
  placeholder: 'Select One or More...',
};
