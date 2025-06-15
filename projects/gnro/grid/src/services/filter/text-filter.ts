import { GnroColumnConfig } from '../../models/grid-column.model';
import { GnroFilter } from './filter';

export class GnroTextFilter extends GnroFilter {
  override set search(val: string) {
    this._search = val;
  }

  override get search(): string {
    return this._search as string;
  }

  constructor(column: GnroColumnConfig, key: string) {
    super(column, key, 'text');
  }
}
