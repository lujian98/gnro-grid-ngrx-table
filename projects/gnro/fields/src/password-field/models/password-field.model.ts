import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroPasswordFieldConfig extends GnroBaseField {
  minLength?: number;
  maxLength?: number;
}

export const defaultPasswordFieldConfig: GnroPasswordFieldConfig = {
  fieldType: GnroObjectType.Password,
  fieldName: 'passwordfield',
  ...defaultBaseField,
};
