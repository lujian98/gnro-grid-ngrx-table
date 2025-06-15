import { GnroDateRange } from '@gnro/ui/fields';
import { GnroColumnConfig } from '../../models/grid-column.model';
import { GnroFilter } from './filter';

export class GnroDateRangeFilter extends GnroFilter {
  get range(): GnroDateRange {
    return this.search as GnroDateRange;
  }

  constructor(column: GnroColumnConfig, key: string) {
    super(column, key, 'dateRange');
  }
}
