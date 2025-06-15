import { GnroColumnConfig } from '../../models/grid-column.model';
import { GnroNumberFilter } from './number-filter';
import { GnroTextFilter } from './text-filter';
import { GnroSelectFilter } from './select-filter';
import { GnroDateRangeFilter } from './date-range-filter';

export class GnroFilterFactory {
  componentMapper: { [index: string]: any } = {};

  constructor() {
    this.componentMapper = {
      text: GnroTextFilter,
      number: GnroNumberFilter,
      select: GnroSelectFilter,
      dateRange: GnroDateRangeFilter,
    };
  }

  getFilter(column: GnroColumnConfig) {
    const filterType = this.getFilterType(column);
    let component = this.componentMapper[filterType];
    if (!component) {
      component = this.componentMapper['text'];
    }
    const componentRef = new component(column, column.name);
    return componentRef;
  }

  private getFilterType(column: GnroColumnConfig): string {
    if (typeof column.filterField === 'string') {
      return column.filterField;
    } else if (column.filterFieldConfig?.fieldType) {
      return column.filterFieldConfig?.fieldType;
    }

    return 'text';
  }
}
