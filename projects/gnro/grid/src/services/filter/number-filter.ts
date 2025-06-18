import { GnroColumnConfig } from '../../models/grid.model';
import { GnroFilter } from './filter';

export enum NumericFilterActions {
  NOT_NULL = 'NOT_NULL',
  NULL = 'NULL',
  GTE = 'GTE',
  GT = 'GT',
  LTE = 'LTE',
  LT = 'LT',
  EQ = 'EQ',
  INCLUDES = 'INCLUDES',
}

export class GnroNumberFilter extends GnroFilter {
  protected _value!: number | null;
  protected _action!: NumericFilterActions | null;

  override set search(val: string) {
    this._search = val;
  }

  override get search(): string {
    return this._search as string;
  }

  // always call the value first, then action
  get value(): number | null {
    this.setValue(this.search);
    return this._value;
  }

  get action(): NumericFilterActions | null {
    return this._action;
  }

  constructor(column: GnroColumnConfig, key: string) {
    super(column, key, 'number');
  }

  setValue(search: string) {
    if (search !== null && search !== '') {
      const str = search.replace(/\s/g, '');
      if (str) {
        const filter = Number(search.replace(/[^0-9.-]/g, ''));
        if (str.includes('!null')) {
          this._value = null;
          this._action = NumericFilterActions.NOT_NULL;
        } else if (str.includes('null')) {
          this._value = null;
          this._action = NumericFilterActions.NULL;
        } else {
          if (str.includes('>=')) {
            this._value = filter;
            this._action = NumericFilterActions.GTE;
          } else if (str.includes('<=')) {
            this._value = filter;
            this._action = NumericFilterActions.LTE;
          } else if (str.includes('>')) {
            this._value = filter;
            this._action = NumericFilterActions.GT;
          } else if (str.includes('<')) {
            this._value = filter;
            this._action = NumericFilterActions.LT;
          } else if (str.includes('=')) {
            this._value = filter;
            this._action = NumericFilterActions.EQ;
          } else {
            this._value = filter;
            this._action = NumericFilterActions.INCLUDES; // Default to INCLUDES
          }
        }
        return;
      }
    }
    this._action = null;
    this._value = null;
  }
}
