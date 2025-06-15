import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroCheckboxFieldConfig extends GnroBaseField {
  labelBeforeCheckbox?: boolean;
}

export const defaultCheckboxFieldConfig: GnroCheckboxFieldConfig = {
  fieldType: GnroObjectType.Checkbox,
  fieldName: 'checkboxfield',
  labelBeforeCheckbox: true,
  ...defaultBaseField,
};
