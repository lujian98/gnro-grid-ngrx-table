import { GnroDateRangeFilter } from '../../filter/date-range-filter';
import { GnroRansackFilter } from './filter';

export class GnroRansackDateRangeFilter<T> extends GnroRansackFilter<T> {
  private _filter!: GnroDateRangeFilter;

  set filter(val: GnroDateRangeFilter) {
    this._filter = val;
  }

  get filter(): GnroDateRangeFilter {
    return this._filter;
  }

  getParams(): T[] {
    const range = this.filter.range;
    const params = [];
    if (range?.fromDate && range?.toDate) {
      const begin = range.fromDate instanceof Date ? range.fromDate : new Date(range.fromDate);
      const end = range.toDate instanceof Date ? range.toDate : new Date(range.toDate);
      const field = this.filter.field;
      let p1: { [index: string]: string } = {};
      p1[field + '_gteq'] = this.encodeISODate(begin);
      params.push(p1);
      p1 = {};
      p1[field + '_lteq'] = this.encodeISODate(end);
      params.push(p1);
    }
    return params as T[];
  }

  private encodeISODate(date: Date) {
    return encodeURIComponent(date.toISOString());
  }
}
