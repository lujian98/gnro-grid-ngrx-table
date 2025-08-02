import { HttpParams } from '@angular/common/http';
import { GnroSortField } from '../models/grid.model';

export function sortHttpParams(sorts: GnroSortField[], params: HttpParams): HttpParams {
  sorts.forEach((sort) => {
    const val = sort.field + '.' + sort.dir;
    params = params.append('order', val.toString());
    if (sort.dir === 'asc') {
      params = params.append('sort', sort.field);
    } else {
      params = params.append('sort', '-' + sort.field);
    }
  });
  return params;
}
