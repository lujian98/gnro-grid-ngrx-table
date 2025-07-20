import { createAction, props } from '@ngrx/store';
import { GnroButtonConfg } from '@gnro/ui/core';
import { GnroFormConfig } from '../models/form.model';
import { GnroFormField } from '@gnro/ui/fields';

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

export const saveFormData = createAction(
  '[Form] Save Form Data',
  props<{ formId: string; formConfig: GnroFormConfig; formData: object }>(),
);

export const saveFormDataSuccessAction = createAction(
  '[Form] Save Form Data Success',
  props<{ formId: string; formConfig: GnroFormConfig; formData: object }>(),
);

/*
export const uploadFiles = createAction(
  '[Form] Upload Files',
  props<{ formConfig: GnroFormConfig; files: GnroUploadFile[] }>(),
);

export const uploadFilesSuccess = createAction('[Form] Upload Files Success', props<{ formConfig: GnroFormConfig }>());
*/

export const clearFormDataStore = createAction('[Form] Clear Form Panel Data Store', props<{ formId: string }>());
export const removeFormDataStore = createAction('[Form] Remove Form Panel Data Store', props<{ formId: string }>());
