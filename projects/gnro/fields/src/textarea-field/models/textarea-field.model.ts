import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroTextareaFieldConfig extends GnroBaseField {
  minLength?: number;
  maxLength?: number;
}

export const defaultTextareaFieldConfig: GnroTextareaFieldConfig = {
  fieldType: GnroObjectType.Textarea,
  fieldName: 'textareafield',
  ...defaultBaseField,
};
