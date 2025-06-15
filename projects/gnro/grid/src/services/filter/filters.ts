import { GnroFilter } from './filter';

export class GnroFilters {
  private _filters: Array<GnroFilter> = [];

  get filters(): Array<GnroFilter> {
    return this._filters;
  }

  update<T>(filteredValues: { [index: string]: string | string[] }) {
    this.filters.forEach((filter) => {
      const key = filter.key;
      if (filteredValues[key]) {
        let value = filteredValues[key];
        if (value instanceof Array) {
          value = value.join();
        }
        filter.search = value;
      } else {
        filter.search = '';
      }
    });
  }
}
