import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroNumberFieldConfig extends GnroBaseField {
  minValue?: number;
  maxValue?: number;
  decimals: number;
}

export const defaultNumberFieldConfig: GnroNumberFieldConfig = {
  fieldType: GnroObjectType.Number,
  fieldName: 'numberfield',
  decimals: 0,
  ...defaultBaseField,
};
