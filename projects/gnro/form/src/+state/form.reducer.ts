import { GnroBUTTONS, GnroButtonConfg, GnroButtonType } from '@gnro/ui/core';
import { GnroFieldsetConfig, GnroFormField, defaultBaseField } from '@gnro/ui/fields';
import { Action, createReducer, on } from '@ngrx/store';
import { defaultFormState } from '../models/default-form';
import { GnroFormState } from '../models/form.model';
import { formActions } from './form.actions';

// Feature key generator for per-formName feature slices
export function getFormFeatureKey(formName: string): string {
  return `form_${formName}`;
}

// Initial state factory for per-formName state
export function getInitialFormState(formName: string): GnroFormState {
  return {
    ...defaultFormState,
    formConfig: {
      ...defaultFormState.formConfig,
      formName,
    },
    formSetting: {
      ...defaultFormState.formSetting,
    },
  };
}

// Cache for reducers by formName
const formReducersByFeature = new Map<string, (state: GnroFormState | undefined, action: Action) => GnroFormState>();

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

// Factory function to create per-formName reducers
export function createFormReducerForFeature(formName: string) {
  // Return cached reducer if available
  const cached = formReducersByFeature.get(formName);
  if (cached) {
    return cached;
  }

  const initialState = getInitialFormState(formName);

  const formReducer = createReducer(
    initialState,
    on(formActions.initConfig, (state, action) => {
      if (action.formName !== formName) return state;
      const formConfig = { ...action.formConfig };
      // Set urlKey to formName if urlKey is empty
      const urlKey = formConfig.urlKey || formConfig.formName;
      // Always start from fresh initial state
      const freshState = getInitialFormState(formName);
      return {
        ...freshState,
        formConfig: {
          ...formConfig,
          urlKey,
        },
        formSetting: {
          ...freshState.formSetting,
        },
      };
    }),
    on(formActions.loadConfigSuccess, (state, action) => {
      if (action.formName !== formName) return state;
      const formConfig = { ...state.formConfig, ...action.formConfig };
      const formFields = setFormFieldsEditable(state.formFields, GnroBUTTONS.View);
      return {
        ...state,
        formConfig,
        formFields,
      };
    }),
    on(formActions.loadFieldsConfigSuccess, (state, action) => {
      if (action.formName !== formName) return state;
      const formFields = setFormFieldsEditable(action.formFields, GnroBUTTONS.View);
      return {
        ...state,
        formFields,
      };
    }),
    on(formActions.setEditable, (state, action) => {
      if (action.formName !== formName) return state;
      const editing = getFormEditable(action.button);
      const formFields = setFormFieldsEditable(state.formFields, action.button);
      return {
        ...state,
        formSetting: {
          ...state.formSetting,
          editing,
        },
        formFields,
      };
    }),
    on(formActions.getDataSuccess, (state, action) => {
      if (action.formName !== formName) return state;
      return {
        ...state,
        formConfig: { ...state.formConfig, ...action.formConfig },
        formData: { ...action.formData },
      };
    }),
    on(formActions.saveDataSuccess, (state, action) => {
      if (action.formName !== formName) return state;
      return {
        ...state,
        formData: { ...action.formData },
      };
    }),
    on(formActions.removeStore, (state, action) => {
      if (action.formName !== formName) return state;
      // Reset to initial state
      return getInitialFormState(formName);
    }),
  );

  const reducer = (state: GnroFormState | undefined, action: Action): GnroFormState => {
    return formReducer(state, action);
  };

  formReducersByFeature.set(formName, reducer);
  return reducer;
}
