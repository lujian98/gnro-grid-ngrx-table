import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroRadioGroup {
  name: string;
  title: string;
}

export interface GnroRadioGroupFieldConfig extends GnroBaseField {
  groups: GnroRadioGroup[];
}

export const defaultRadioGroupFieldConfig: GnroRadioGroupFieldConfig = {
  fieldType: GnroObjectType.RadioGroup,
  fieldName: 'radiogroupfield',
  groups: [],
  ...defaultBaseField,
};
