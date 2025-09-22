import { GnroButtonConfg, GnroDataType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { createActionGroup, props } from '@ngrx/store';
import { GnroFormConfig } from '../models/form.model';

export const formActions = createActionGroup({
  source: 'Form',
  events: {
    'Init Config': props<{ formId: string; formConfig: GnroFormConfig }>(),
    'Load Config': props<{ formId: string; formConfig: GnroFormConfig }>(),
    'Load Config Success': props<{ formId: string; formConfig: GnroFormConfig }>(),
    'Load Fields Config': props<{ formId: string; formConfig: GnroFormConfig }>(),
    'Load Fields Config Success': props<{
      formId: string;
      formConfig: GnroFormConfig;
      formFields: GnroFormField[];
    }>(),
    'Set Editable': props<{ formId: string; button: GnroButtonConfg }>(),
    'Get Data': props<{ formId: string; formConfig: GnroFormConfig }>(),
    'Get Data Success': props<{ formId: string; formConfig: GnroFormConfig; formData: GnroDataType }>(),
    'Save Data': props<{ formId: string; formConfig: GnroFormConfig; formData: GnroDataType }>(),
    'Save Data Success': props<{ formId: string; formConfig: GnroFormConfig; formData: GnroDataType }>(),
    'Clear Store': props<{ formId: string }>(),
    'Remove Store': props<{ formId: string }>(),
  },
});
