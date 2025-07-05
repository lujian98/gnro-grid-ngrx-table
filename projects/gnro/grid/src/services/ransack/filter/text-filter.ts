import { GnroTextFilter } from '../../filter/text-filter';
import { GnroRansackFilter } from './filter';

export class GnroRansackTextFilter<T> extends GnroRansackFilter<T> {
  private _filter!: GnroTextFilter;

  set filter(val: GnroTextFilter) {
    this._filter = val;
  }

  get filter(): GnroTextFilter {
    return this._filter;
  }

  getParams(): T[] {
    let value = this.filter.search;
    const params = [];
    if (value) {
      let query = '';
      if (value.startsWith('*')) {
        query = '_end';
        value = value.substring(1);
      } else if (value.endsWith('*')) {
        query = '_start';
        value = value.substring(0, value.length - 1);
      } else if (value.startsWith('=')) {
        query = '_eq';
        value = value.substring(1);
      } else if (value.startsWith('"') && value.endsWith('"')) {
        query = '_eq';
        value = value.substring(1, value.length - 1);
      } else {
        query = '_i_cont';
      }

      const key = this.filter.field + query;
      const p: { [index: string]: string } = {};
      p[key] = value;
      params.push(p);
    }
    return params as T[];
  }
}
