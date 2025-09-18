import { ValidatorFn } from '@angular/forms';
import { GnroButtonConfg, GnroDataType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';

export interface GnroFormConfig {
  urlKey: string; // Only for remote config
  title?: string;
  remoteFormConfig: boolean;
  remoteFieldsConfig: boolean;
  remoteFormData: boolean;
  labelWidth?: number | string;
  validators?: ValidatorFn | ValidatorFn[];
  autoFitHeight: boolean;
  buttons: GnroButtonConfg[];
  editing: boolean;
}

export interface GnroFormConfigResponse {
  formConfig: Partial<GnroFormConfig>;
}

export interface GnroFormFieldsResponse {
  formFields: GnroFormField[];
}

export interface GnroFormRecordResponse {
  formData: GnroDataType;
}

export interface GnroFormSetting {
  // for internal setting
  formId: string; // auto generated unique id
  editing: boolean;
}

export interface FormState {
  [key: string]: GnroFormState;
}

export interface GnroFormState {
  formConfig: GnroFormConfig;
  formSetting: GnroFormSetting;
  formFields: GnroFormField[];
  formData: GnroDataType | undefined;
}

export interface GnroFormButtonClick {
  button: GnroButtonConfg;
  formData: GnroDataType;
}
