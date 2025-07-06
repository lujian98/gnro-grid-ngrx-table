import { GnroSelectFieldConfig, GnroFieldConfigResponse } from '@gnro/ui/fields';

export const SingleSelectConfig: GnroFieldConfigResponse = {
  fieldConfig: {
    fieldLabel: 'Single Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  },
};

export const MultiSelectConfig: GnroFieldConfigResponse = {
  fieldConfig: {
    multiSelection: true,
    fieldLabel: 'Multi Selection (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  },
};

export const SingleAutocompleteConfig: GnroFieldConfigResponse = {
  fieldConfig: {
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One...',
  },
};

export const MultiAutocompleteConfig: GnroFieldConfigResponse = {
  fieldConfig: {
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (Object)',
    optionLabel: 'state',
    optionKey: 'abbr',
    placeholder: 'Select One or More...',
  },
};

export const SingleListConfig: GnroFieldConfigResponse = {
  fieldConfig: {
    fieldLabel: 'Single Selection (List)',
    placeholder: 'Select One...',
  },
};

export const MultiListConfig: GnroFieldConfigResponse = {
  fieldConfig: {
    multiSelection: true,
    fieldLabel: 'Multi Selection (List)',
    placeholder: 'Select One or More...',
  },
};

export const SingleAutocompleteLisConfig: GnroFieldConfigResponse = {
  fieldConfig: {
    selectOnly: false,
    fieldLabel: 'Single Autocomplete (List)',
    placeholder: 'Select One...',
  },
};

export const MultiAutocompleteListConfig: GnroFieldConfigResponse = {
  fieldConfig: {
    multiSelection: true,
    selectOnly: false,
    fieldLabel: 'Multi Autocomplete (List)',
    placeholder: 'Select One or More...',
  },
};
