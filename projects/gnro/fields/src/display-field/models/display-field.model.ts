import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroDisplayFieldConfig extends GnroBaseField {}

export const defaultDisplayFieldConfig: GnroDisplayFieldConfig = {
  fieldType: GnroObjectType.Display,
  fieldName: 'displayfield',
  ...defaultBaseField,
  editButtons: [],
};
