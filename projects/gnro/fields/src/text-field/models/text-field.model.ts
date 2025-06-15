import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroTextFieldConfig extends GnroBaseField {
  minLength?: number;
  maxLength?: number;
}

export const defaultTextFieldConfig: GnroTextFieldConfig = {
  fieldType: GnroObjectType.Text,
  fieldName: 'textfield',
  ...defaultBaseField,
};
