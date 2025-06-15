import { GnroSelectFilter } from '../../filter/select-filter';
import { GnroRansackFilter } from './filter';

export class GnroRansackSelectFilter<T> extends GnroRansackFilter<T> {
  private _filter!: GnroSelectFilter<T>;

  set filter(val: GnroSelectFilter<T>) {
    this._filter = val;
  }

  get filter(): GnroSelectFilter<T> {
    return this._filter;
  }

  getParams(): T[] {
    const choices = this.filter.choices;
    const params: T[] = [];
    if (choices.length > 0) {
      choices.forEach((value) => {
        let key = this.filter.field + (choices.length > 1 ? '_in[]' : '_in');
        const p: { [index: string]: T } = {};
        let val = value;
        if (value === 'isEmpty') {
          key = this.filter.field + '_null';
        } else if (value === 'notEmpty') {
          key = this.filter.field + '_not_null';
        }
        p[key] = val;
        params.push(p as T);
      });
    }
    return params as T[];
  }
}
