import { GnroSelectFieldConfig } from '@gnro/ui/fields';

export const SingleSelectConfig: Partial<GnroSelectFieldConfig> = {
  fieldLabel: 'Single Selection (Object)',
  optionLabel: 'state',
  optionKey: 'abbr',
  placeholder: 'Select One...',
};

export const MultiSelectConfig: Partial<GnroSelectFieldConfig> = {
  multiSelection: true,
  fieldLabel: 'Multi Selection (Object)',
  optionLabel: 'state',
  optionKey: 'abbr',
  placeholder: 'Select One or More...',
};

export const SingleAutocompleteConfig: Partial<GnroSelectFieldConfig> = {
  selectOnly: false,
  fieldLabel: 'Single Autocomplete (Object)',
  optionLabel: 'state',
  optionKey: 'abbr',
  placeholder: 'Select One...',
};

export const MultiAutocompleteConfig: Partial<GnroSelectFieldConfig> = {
  multiSelection: true,
  selectOnly: false,
  fieldLabel: 'Multi Autocomplete (Object)',
  optionLabel: 'state',
  optionKey: 'abbr',
  placeholder: 'Select One or More...',
};

export const SingleListConfig: Partial<GnroSelectFieldConfig> = {
  fieldLabel: 'Single Selection (List)',
  placeholder: 'Select One...',
};

export const MultiListConfig: Partial<GnroSelectFieldConfig> = {
  multiSelection: true,
  fieldLabel: 'Multi Selection (List)',
  placeholder: 'Select One or More...',
};

export const SingleAutocompleteLisConfig: Partial<GnroSelectFieldConfig> = {
  selectOnly: false,
  fieldLabel: 'Single Autocomplete (List)',
  placeholder: 'Select One...',
};

export const MultiAutocompleteListConfig: Partial<GnroSelectFieldConfig> = {
  multiSelection: true,
  selectOnly: false,
  fieldLabel: 'Multi Autocomplete (List)',
  placeholder: 'Select One or More...',
};
