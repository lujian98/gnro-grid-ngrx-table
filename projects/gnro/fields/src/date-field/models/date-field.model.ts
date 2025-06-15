import { GnroObjectType } from '@gnro/ui/core';
import { GnroBaseField } from '../../models/base-field.model';

export interface GnroDateFieldConfig extends GnroBaseField {
  selectedLabel?: string;
  dateFormat: string;
  excludeWeekends: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
}

export const defaultDateFieldConfig: GnroDateFieldConfig = {
  fieldType: GnroObjectType.Date,
  fieldName: 'datefield',
  placeholder: 'GNRO.UI.DATE.PICKER.SELECT_DATE',
  clearValue: true,

  selectedLabel: 'GNRO.UI.DATE.PICKER.SELECTED_DATE',
  dateFormat: 'mediumDate',
  excludeWeekends: false,
  minDate: null,
  maxDate: null,
};

export interface GnroDatePresetItem {
  label: string;
  date: Date;
}

export const presetDateSelectionConfig = {
  fieldName: 'preset',
  fieldLabel: 'GNRO.UI.DATE.PICKER.SELECT_DATE',
  labelWidth: 60,
  optionLabel: 'label',
  optionKey: 'date',
  clearValue: false,
};

const backDate = (numOfDays: number) => {
  const day = new Date();
  return new Date(day.setDate(day.getDate() - numOfDays));
};

function get1stDayOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 0);
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

const today = new Date();
const yesterday = backDate(1);
const minus7 = backDate(7);
const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

export const gnroDefaultDatePresets = [
  { label: 'Today', date: today },
  { label: 'Yesterday', date: yesterday },
  { label: '7 Days Ago', date: minus7 },
  { label: 'This Week', date: get1stDayOfWeek(today) },
  { label: 'Last Week', date: get1stDayOfWeek(minus7) },
  { label: 'This Month', date: currMonthStart },
  { label: 'Last Month', date: lastMonthStart },
];
