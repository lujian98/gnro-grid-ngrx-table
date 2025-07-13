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
import { GnroFilterFactory } from './filter/filter-factory';
import { GnroRansackFilterFactory } from './ransack/filter/filter-factory';

@Injectable({
  providedIn: 'root',
})
export class GnroGridService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  getGridConfig(gridConfig: GnroGridConfig): Observable<GnroGridConfig> {
    const params = this.backendService.getParams(gridConfig.urlKey, 'gridConfig');
    const url = this.backendService.apiUrl;
    return this.http.get<GnroGridConfigResponse>(url, { params }).pipe(
      map((config) => {
        return {
          ...gridConfig,
          ...config.gridConfig,
        };
      }),
    );
  }

  getGridColumnsConfig(gridConfig: GnroGridConfig): Observable<GnroColumnConfig[]> {
    const params = this.backendService.getParams(gridConfig.urlKey, 'columnsConfig');
    const url = this.backendService.apiUrl;
    return this.http.get<GnroColumnsConfigResponse>(url, { params }).pipe(
      map((res) => {
        return res.columnsConfig;
      }),
    );
  }

  getGridInMemoeryData<T>(gridConfig: GnroGridConfig, columns: GnroColumnConfig[]): Observable<GnroGridData<T>> {
    return of();
  }

  saveModifiedRecords(
    gridConfig: GnroGridConfig,
    modifiedRecords: { [key: string]: unknown }[],
  ): Observable<{ [key: string]: unknown }[]> {
    const params = this.backendService.getParams(gridConfig.urlKey, 'update');
    const headers = new HttpHeaders({ Accept: 'application/vnd.api+json' });
    const url = this.backendService.apiUrl;
    return this.http
      .patch<any>(url, modifiedRecords, {
        params: params,
        headers: headers,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => throwError(() => error)),
      );
  }

  saveGridConfigs(gridConfig: GnroGridConfig, columnsConfig: GnroColumnConfig[]): Observable<Object> {
    const headers = new HttpHeaders(ACCEPT_JSON_API_HEADER);
    let params = this.backendService.getParams(gridConfig.urlKey, 'pageConfig');

    const url = this.backendService.apiUrl;
    if (gridConfig.remoteGridConfig && gridConfig.remoteColumnsConfig) {
      params = params.append('configType', 'gridConfig');
      params = params.append('configData', JSON.stringify(gridConfig));

      let params2 = this.backendService.getParams(gridConfig.urlKey, 'pageConfig');
      params2 = params2.append('configType', 'columnsConfig');
      params2 = params2.append('configData', JSON.stringify(columnsConfig));

      return forkJoin([
        this.http.put(url, params, { headers: headers }),
        this.http.put(url, params2, { headers: headers }),
      ]);
    } else if (gridConfig.remoteGridConfig) {
      params = params.append('configType', 'gridConfig');
      params = params.append('configData', JSON.stringify(gridConfig));
      return this.http.put(url, params, { headers: headers });
    } else if (gridConfig.remoteColumnsConfig) {
      params = params.append('configType', 'columnsConfig');
      params = params.append('configData', JSON.stringify(columnsConfig));
      return this.http.put(url, params, { headers: headers });
    } else {
      return of(gridConfig);
    }
  }

  getGridData<T>(gridConfig: GnroGridConfig, columns: GnroColumnConfig[]): Observable<GnroGridData<object>> {
    let params = this.backendService.getParams(gridConfig.urlKey, 'gridData');
    params = this.appendFilterHttpParams(gridConfig.columnFilters, columns, params);
    params = this.appendSortHttpParams(gridConfig.sortFields, params);
    const offset = (gridConfig.page - 1) * gridConfig.pageSize;
    const limit = gridConfig.pageSize;
    params = params.append('offset', offset.toString());
    params = params.append('limit', limit.toString());
    const url = this.backendService.apiUrl;
    return this.http.get<GnroGridData<object>>(url, { params }).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) =>
        throwError(() => {
          return error;
        }),
      ),
    );
  }

  appendFilterHttpParams(
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

  appendSortHttpParams(sorts: GnroSortField[], params: HttpParams): HttpParams {
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
}
