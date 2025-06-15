import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField } from '../../models/base-field.model';
import { GnroFormField } from '../../models/fields.model';

export interface GnroFieldsetConfig extends GnroBaseField {
  legend?: string;
  labelWidth?: number | string;
  flexDirection: 'column' | 'row';
  formFields: GnroFormField[];
}

export const defaultFieldsetConfig: GnroFieldsetConfig = {
  fieldType: GnroObjectType.Fieldset,
  fieldName: 'fieldset',
  flexDirection: 'column',
  formFields: [],
};
