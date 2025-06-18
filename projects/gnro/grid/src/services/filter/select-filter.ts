import { GnroColumnConfig } from '../../models/grid.model';
import { GnroFilter } from './filter';

export enum GnroSelectFilterValues {
  NOT_NULL = 'not_null',
  NULL = 'null',
}

export class GnroSelectFilter<T> extends GnroFilter {
  private _choices: T[] = [];
  private _multiSelect = false;

  set multiSelect(val: boolean) {
    this._multiSelect = val;
  }

  get multiSelect(): boolean {
    return this._multiSelect;
  }

  get choices(): T[] {
    if (this.search instanceof Array) {
      this._choices = this.search.map((item) => item.name || item);
    } else {
      this._choices = [];
    }
    return this._choices;
  }

  constructor(column: GnroColumnConfig, key: string) {
    super(column, key, 'select');
  }
}
