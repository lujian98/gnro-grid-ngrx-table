import { GnroButtonConfg } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { createActionGroup, props } from '@ngrx/store';
import { GnroFormConfig } from '../models/form.model';

export const formActions = createActionGroup({
  source: '[Form]',
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
    'Get Data Success': props<{ formId: string; formConfig: GnroFormConfig; formData: object }>(),
    'Save Data': props<{ formId: string; formConfig: GnroFormConfig; formData: object }>(),
    'Save Data Success': props<{ formId: string; formConfig: GnroFormConfig; formData: object }>(),
    'Clear Store': props<{ formId: string }>(),
    'Remove Store': props<{ formId: string }>(),
  },
});

/*
export const saveFormData = createAction(
  '[Form] Save Form Data',
  props<{ formId: string; formConfig: GnroFormConfig; formData: object }>(),
);

export const saveFormDataSuccessAction = createAction(
  '[Form] Save Form Data Success',
  props<{ formId: string; formConfig: GnroFormConfig; formData: object }>(),
);

export const clearFormDataStore = createAction('[Form] Clear Form Panel Data Store', props<{ formId: string }>());
export const removeFormDataStore = createAction('[Form] Remove Form Panel Data Store', props<{ formId: string }>());



export const initFormConfig = createAction(
  '[Form] Init Form Panel Config',
  props<{ formId: string; formConfig: GnroFormConfig }>(),
);
export const loadRemoteFormConfig = createAction(
  '[Form] Load Remote Form Config',
  props<{ formId: string; formConfig: GnroFormConfig }>(),
);
export const loadRemoteFormConfigSuccess = createAction(
  '[Form] Load Remote Form Config Success',
  props<{ formId: string; formConfig: GnroFormConfig }>(),
);
export const loadFormFieldsConfig = createAction(
  '[Form] Load Remote Form Fields Config',
  props<{ formId: string; formConfig: GnroFormConfig }>(),
);
export const loadFormFieldsConfigSuccess = createAction(
  '[Form] Load Remote Form Fields Config Success',
  props<{ formId: string; formConfig: GnroFormConfig; formFields: GnroFormField[] }>(),
);
export const setFormEditable = createAction(
  '[Form] Set Form Editable',
  props<{ formId: string; button: GnroButtonConfg }>(),
);
export const getFormData = createAction(
  '[Form] Get Form Data',
  props<{ formId: string; formConfig: GnroFormConfig }>(),
);
export const getFormDataSuccess = createAction(
  '[Form] Get Form Data Success',
  props<{ formId: string; formConfig: GnroFormConfig; formData: object }>(),
);
*/
