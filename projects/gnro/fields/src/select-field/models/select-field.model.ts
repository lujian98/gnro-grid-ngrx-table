import { GnroBaseField } from '../../models/base-field.model';

export type GnroOptionType = string | object;

//TODO add filter remote option if needed???
export interface GnroSelectFieldConfig extends GnroBaseField {
  urlKey: string; // Only for remote field config and options
  remoteConfig: boolean; // remote config requires remote options
  remoteOptions: boolean;
  selectOnly: boolean; // true select, false autocomplete
  multiSelection: boolean;
  checkAll: boolean; // only for multiSelection is true
  uncheckAll: boolean; // only for multiSelection is true
  isEmpty: boolean;
  notEmpty: boolean;
  optionLabel: string;
  optionKey: string;
  options?: GnroOptionType[]; // only used for local initial input
  displayWith?: (value: string | object | object[]) => string;
}

export interface GnroSelectFieldSetting {
  // for internal setting
  fieldId: string;
  viewportReady: boolean;
  singleListOption: boolean;
}

export interface SelectFieldState {
  [key: string]: GnroSelectFieldState;
}

export interface GnroSelectFieldState {
  fieldConfig: GnroSelectFieldConfig;
  fieldSetting: GnroSelectFieldSetting;
  options: GnroOptionType[];
}
