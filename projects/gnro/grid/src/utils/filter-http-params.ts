import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ACCEPT_JSON_API_HEADER, GnroBackendService } from '@gnro/ui/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import {
  GnroColumnConfig,
  GnroColumnFilter,
  GnroColumnsConfigResponse,
  GnroGridConfig,
  GnroGridConfigResponse,
  GnroGridData,
  GnroSortField,
} from '../models/grid.model';
import { GnroFilterFactory } from '../services/filter/filter-factory';
import { GnroRansackFilterFactory } from '../services/ransack/filter/filter-factory';

export function filterHttpParams(
  columnFilters: GnroColumnFilter[],
  columns: GnroColumnConfig[],
  params: HttpParams,
): HttpParams {
  const ransackFilterFactory = new GnroRansackFilterFactory();
  const filterFactory = new GnroFilterFactory();
  columnFilters.forEach((col) => {
    const column = columns.find((item) => item.name === col.name);
    const filter = filterFactory.getFilter(column!);
    filter.search = col.value;
    const ransackFilter = ransackFilterFactory.getFilter(filter);
    const filterParams = ransackFilter.getParams();
    if (filterParams && filterParams.length > 0) {
      filterParams.forEach((pairs: { [index: string]: string | number }) => {
        Object.keys(pairs).forEach((key) => {
          let value = pairs[key];
          value = value || value === 0 ? value.toString() : '';
          params = params.append(key, value);
        });
      });
    }
  });
  return params;
}
