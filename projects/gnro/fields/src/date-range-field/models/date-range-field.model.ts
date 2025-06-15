import { GnroObjectType } from '@gnro/ui/core';
import { GnroDateFieldConfig } from '../../date-field/models/date-field.model';

export interface GnroDateRange {
  fromDate?: Date | null;
  toDate?: Date | null;
}

export interface GnroDateRangeFieldConfig extends GnroDateFieldConfig {
  startDateLabel: string;
  endDateLabel: string;
  fromMinMax: GnroDateRange;
  toMinMax: GnroDateRange;
}

export const defaultDateRangeFieldConfig: GnroDateRangeFieldConfig = {
  fieldType: GnroObjectType.DateRange,
  fieldName: 'daterangefield',
  placeholder: 'GNRO.UI.DATE.PICKER.SELECT_DATE_RANGE',
  clearValue: true,

  dateFormat: 'mediumDate',
  excludeWeekends: false,
  startDateLabel: 'GNRO.UI.DATE.PICKER.FROM',
  endDateLabel: 'GNRO.UI.DATE.PICKER.TO',
  fromMinMax: { fromDate: null, toDate: null },
  toMinMax: { fromDate: null, toDate: null },
};

export interface GnroDateRangePresetItem {
  label: string;
  range: GnroDateRange;
}

export const presetSelectionConfig = {
  fieldName: 'preset',
  fieldLabel: 'GNRO.UI.DATE.PICKER.SELECT_DATE_RANGE',
  labelWidth: 100,
  optionLabel: 'label',
  optionKey: 'range',
  clearValue: false,
};

const backDate = (numOfDays: number) => {
  const day = new Date();
  return new Date(day.setDate(day.getDate() - numOfDays));
};

const today = new Date();
const yesterday = backDate(1);
const minus7 = backDate(7);
const minus30 = backDate(30);
const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

export const gnroDefaultDateRangePresets: GnroDateRangePresetItem[] = [
  {
    label: 'GNRO.UI.DATE.FILTER.YESTERDAY',
    range: { fromDate: yesterday, toDate: today },
  },
  {
    label: 'GNRO.UI.DATE.FILTER.LAST_7_DAYS',
    range: { fromDate: minus7, toDate: today },
  },
  {
    label: 'GNRO.UI.DATE.FILTER.LAST_30_DAYS',
    range: { fromDate: minus30, toDate: today },
  },
  {
    label: 'GNRO.UI.DATE.FILTER.THIS_MONTH',
    range: { fromDate: currMonthStart, toDate: currMonthEnd },
  },
  {
    label: 'GNRO.UI.DATE.FILTER.LAST_MONTH',
    range: { fromDate: lastMonthStart, toDate: lastMonthEnd },
  },
];
