import { GnroButtonConfg, GnroDataType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { createActionGroup, props } from '@ngrx/store';
import { GnroFormConfig } from '../models/form.model';

export const formActions = createActionGroup({
  source: 'Form',
  events: {
    'Init Config': props<{ formName: string; formConfig: GnroFormConfig }>(),
    'Load Config': props<{ formName: string; formConfig: GnroFormConfig }>(),
    'Load Config Success': props<{ formName: string; formConfig: GnroFormConfig }>(),
    'Load Fields Config': props<{ formName: string; formConfig: GnroFormConfig }>(),
    'Load Fields Config Success': props<{
      formName: string;
      formConfig: GnroFormConfig;
      formFields: GnroFormField[];
    }>(),
    'Set Editable': props<{ formName: string; button: GnroButtonConfg }>(),
    'Get Data': props<{ formName: string; formConfig: GnroFormConfig }>(),
    'Get Data Success': props<{ formName: string; formConfig: GnroFormConfig; formData: GnroDataType }>(),
    'Save Data': props<{ formName: string; formConfig: GnroFormConfig; formData: GnroDataType }>(),
    'Save Data Success': props<{ formName: string; formConfig: GnroFormConfig; formData: GnroDataType }>(),
    'Clear Store': props<{ formName: string }>(),
    'Remove Store': props<{ formName: string }>(),
  },
});
