import { createFeature, createReducer, on } from '@ngrx/store';
import { GnroBUTTONS, GnroButtonConfg, GnroButtonType } from '@gnro/ui/core';
import * as formActions from './form.actions';
import { FormState } from '../models/form.model';
import { defaultFormState } from '../models/default-form';
import { GnroFormField, GnroFieldsetConfig, defaultBaseField } from '@gnro/ui/fields';

export const initialState: FormState = {};

export function getFormEditable(button: GnroButtonConfg): boolean {
  switch (button.name) {
    case GnroButtonType.Refresh:
    case GnroButtonType.View:
      return false;
    case GnroButtonType.Edit:
    case GnroButtonType.Reset:
    case GnroButtonType.Save:
    default:
      return true;
  }
}

export function getFieldEditable(formField: GnroFormField, button: GnroButtonConfg): boolean {
  switch (button.name) {
    case GnroButtonType.Refresh:
    case GnroButtonType.View:
      return false;
    case GnroButtonType.Edit:
    case GnroButtonType.Reset:
    case GnroButtonType.Save:
    default:
      return true;
  }
}

export function setFormFieldsEditable(formFields: GnroFormField[], button: GnroButtonConfg): GnroFormField[] {
  return [
    ...formFields.map((field) => {
      if (field.fieldType === 'fieldset') {
        const newfield = field as GnroFieldsetConfig;
        return {
          ...field,
          formFields: setFormFieldsEditable(newfield.formFields, button),
        };
      } else {
        if (button.name === GnroButtonType.Reset || button.name === GnroButtonType.Save) {
          return { ...field };
        } else {
          const editButtons = field.editButtons ? field.editButtons : defaultBaseField.editButtons;
          const editable = !!editButtons?.find((item) => item === button.name);
          return { ...field, editable };
        }
      }
    }),
  ] as GnroFormField[];
}

export const gnroFormFeature = createFeature({
  name: 'gnroForm',
  reducer: createReducer(
    initialState,
    on(formActions.initFormConfig, (state, action) => {
      const key = action.formId;
      const newState: FormState = { ...state };
      newState[key] = {
        ...defaultFormState,
        formConfig: { ...action.formConfig },
        formSetting: {
          ...defaultFormState.formSetting,
          formId: action.formId,
        },
      };
      return { ...newState };
    }),
    on(formActions.loadRemoteFormConfigSuccess, (state, action) => {
      const key = action.formId;
      const newState: FormState = { ...state };
      if (state[key]) {
        const formConfig = { ...state[key].formConfig, ...action.formConfig };
        const formFields = setFormFieldsEditable(state[key].formFields, GnroBUTTONS.View);
        newState[key] = {
          ...state[key],
          formConfig,
          formFields,
        };
      }
      return { ...newState };
    }),
    on(formActions.loadFormFieldsConfigSuccess, (state, action) => {
      const key = action.formId;
      const newState: FormState = { ...state };
      if (state[key]) {
        const formFields = setFormFieldsEditable(action.formFields, GnroBUTTONS.View);
        newState[key] = {
          ...state[key],
          formFields,
        };
      }
      return { ...newState };
    }),
    on(formActions.setFormEditable, (state, action) => {
      const key = action.formId;
      const newState: FormState = { ...state };
      if (state[key]) {
        const editing = getFormEditable(action.button);
        const formFields = setFormFieldsEditable(state[key].formFields, action.button);
        newState[key] = {
          ...state[key],
          formSetting: {
            ...state[key].formSetting,
            editing,
          },
          formFields,
        };
      }
      return { ...newState };
    }),
    on(formActions.getFormDataSuccess, (state, action) => {
      const key = action.formId;
      const newState: FormState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          formConfig: { ...state[key].formConfig, ...action.formConfig },
          formData: { ...action.formData },
        };
      }
      return { ...newState };
    }),
    on(formActions.saveFormDataSuccess, (state, action) => {
      const key = action.formId;
      const newState: FormState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          formData: { ...action.formData },
        };
      }
      return { ...newState };
    }),
    on(formActions.removeFormDataStore, (state, action) => {
      const key = action.formId;
      const newState: FormState = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
