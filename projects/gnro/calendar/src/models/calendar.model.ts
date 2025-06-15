export interface GnroCalendarConfig {
  viewType: string; // calendar | rangeFrom | rangeTo
  selectedLabel?: string;
  dateFormat: string;
  excludeWeekends: boolean;
  minDate: Date | null;
  maxDate: Date | null;
}

export const defaultCalendarConfig: GnroCalendarConfig = {
  viewType: 'calendar',
  dateFormat: 'mediumDate',
  excludeWeekends: false,
  minDate: null,
  maxDate: null,
};
