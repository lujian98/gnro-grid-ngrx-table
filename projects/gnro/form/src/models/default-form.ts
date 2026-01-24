import { GnroFormConfig, GnroFormState, GnroFormSetting } from './form.model';
import { GnroBUTTONS, GnroButtonConfg } from '@gnro/ui/core';

export const buttons: GnroButtonConfg[] = [
  GnroBUTTONS.Edit,
  GnroBUTTONS.Refresh,
  GnroBUTTONS.Save,
  GnroBUTTONS.Reset,
  GnroBUTTONS.View,
];

export const defaultFormConfig: GnroFormConfig = {
  formName: 'form',
  title: 'Default Form',
  urlKey: 'formfields', // Only for remote config
  remoteFormConfig: false,
  remoteFieldsConfig: false,
  remoteFormData: false,
  autoFitHeight: true,
  buttons: buttons,
  editing: false,
};

export const defaultFormSetting: GnroFormSetting = {
  editing: false,
};

export const defaultFormState: GnroFormState = {
  formConfig: defaultFormConfig,
  formSetting: defaultFormSetting,
  formFields: [],
  formData: undefined,
};
