import { GnroNumberFilter, NumericFilterActions } from '../../filter/number-filter';
import { GnroRansackFilter } from './filter';

export class GnroRansackNumberFilter<T> extends GnroRansackFilter<T> {
  private _filter!: GnroNumberFilter;

  set filter(val: GnroNumberFilter) {
    this._filter = val;
  }

  get filter(): GnroNumberFilter {
    return this._filter;
  }

  getParams(): T[] {
    let value = this.filter.value;
    const params = [];
    if (this.filter.action) {
      let key = this.filter.field + '_';
      switch (this.filter.action) {
        case NumericFilterActions.NOT_NULL:
          key += 'not_null';
          value = 1;
          break;
        case NumericFilterActions.NULL:
          key += 'null';
          value = 1;
          break;
        case NumericFilterActions.GTE:
          key += 'gteq';
          break;
        case NumericFilterActions.GT:
          key += 'gt';
          break;
        case NumericFilterActions.LTE:
          key += 'lteq';
          break;
        case NumericFilterActions.LT:
          key += 'lt';
          break;
        case NumericFilterActions.EQ:
          key += 'eq';
          break;
        case NumericFilterActions.INCLUDES:
          key += 'cont';
          break;
      }
      const p: { [index: string]: number | null } = {};
      p[key] = value;
      params.push(p);
    }
    return params as T[];
  }
}
