import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField, defaultBaseField } from '../../models/base-field.model';

export interface GnroHiddenFieldConfig extends GnroBaseField {}

export const defaultHiddenFieldConfig: GnroHiddenFieldConfig = {
  fieldType: GnroObjectType.Hidden,
  fieldName: 'hiddenfield',
  ...defaultBaseField,
  editButtons: [],
};
