import { GnroObjectType } from '@gnro/ui/core';
import { GnroSelectFieldConfig, GnroSelectFieldState, GnroSelectFieldSetting } from './select-field.model';
import { defaultBaseField } from '../../models/base-field.model';

export const defaultSelectFieldConfig: GnroSelectFieldConfig = {
  fieldType: GnroObjectType.Select,
  fieldName: 'selectfield', // form field name need set
  urlKey: 'select', // Only for remote field config and options
  fieldLabel: undefined,
  remoteConfig: false, // remote config requires remote options
  remoteOptions: false,
  selectOnly: true, // true select, false autocomplete
  multiSelection: false,
  checkAll: true,
  uncheckAll: true,
  isEmpty: false,
  notEmpty: false,
  optionLabel: 'title',
  optionKey: 'name',
  optionHeight: 28,
  ...defaultBaseField,
};

export const defaultSelectFieldSetting: GnroSelectFieldSetting = {
  fieldId: '191cf2bb6b5',
  viewportReady: false,
  singleListOption: false,
};

export const defaultSelectFieldState: GnroSelectFieldState = {
  fieldConfig: defaultSelectFieldConfig,
  fieldSetting: defaultSelectFieldSetting,
  options: [],
};
