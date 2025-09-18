import { GnroBUTTONS, GnroButtonConfg, GnroButtonType, GnroOnAction } from '@gnro/ui/core';
import { GnroFieldsetConfig, GnroFormField, defaultBaseField } from '@gnro/ui/fields';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultFormState } from '../models/default-form';
import { FormState } from '../models/form.model';
import { formActions } from './form.actions';

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

export const gnroFormOnActions: GnroOnAction<FormState>[] = [
  on(formActions.initConfig, (state, action) => {
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
  on(formActions.loadConfigSuccess, (state, action) => {
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
  on(formActions.loadFieldsConfigSuccess, (state, action) => {
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
  on(formActions.setEditable, (state, action) => {
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
  on(formActions.getDataSuccess, (state, action) => {
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
  on(formActions.saveDataSuccess, (state, action) => {
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
  on(formActions.removeStore, (state, action) => {
    const key = action.formId;
    const newState: FormState = { ...state };
    if (state[key]) {
      delete newState[key];
    }
    return { ...newState };
  }),
];

export const gnroFormReducer = createReducer(initialState, ...gnroFormOnActions);
export const gnroFormFeature = createFeature({ name: 'gnroForm', reducer: gnroFormReducer });
