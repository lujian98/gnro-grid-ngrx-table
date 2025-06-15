import { GnroFilter } from '../../filter/filter';
import { GnroFilters } from '../../filter/filters';
import { GnroRansackFilter } from './filter';
import { GnroRansackTextFilter } from './text-filter';
import { GnroRansackNumberFilter } from './number-filter';
import { GnroRansackSelectFilter } from './select-filter';
import { GnroRansackDateRangeFilter } from './date-range-filter';

export class GnroRansackFilterFactory<T> {
  componentMapper: { [index: string]: any };

  constructor() {
    this.componentMapper = {
      text: GnroRansackTextFilter,
      number: GnroRansackNumberFilter,
      select: GnroRansackSelectFilter,
      dateRange: GnroRansackDateRangeFilter,
    };
  }

  getFilter(filter: GnroFilter) {
    const filterType = filter.type;
    const component = this.componentMapper[filterType];
    const componentRef = new component();
    componentRef.filter = filter;
    return componentRef;
  }

  getRansackFilters(filters: GnroFilters): GnroRansackFilter<T>[] {
    const ransackFilters: Array<GnroRansackFilter<T>> = [];
    for (const filter of filters.filters) {
      ransackFilters.push(this.getFilter(filter));
    }
    return ransackFilters;
  }
}
