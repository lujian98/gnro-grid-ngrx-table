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
    let params = this.backendService.getParams(gridConfig.urlKey, 'gridConfig');
    params = params.append('useDefaultConfig', !gridConfig.saveGridConfig);
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
    let params = this.backendService.getParams(gridConfig.urlKey, 'columnsConfig');
    params = params.append('useDefaultConfig', !gridConfig.saveColumnsConfig);
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
    const url = this.backendService.apiUrl;
    if (gridConfig.saveGridConfig && gridConfig.saveColumnsConfig) {
      const gridConfigParams = this.getPageConfigParams(gridConfig.urlKey, 'gridConfig', gridConfig);
      const columnsConfigParams = this.getPageConfigParams(gridConfig.urlKey, 'columnsConfig', columnsConfig);
      return forkJoin([
        this.http.put(url, gridConfigParams, { headers: headers }),
        this.http.put(url, columnsConfigParams, { headers: headers }),
      ]);
    } else if (gridConfig.saveGridConfig) {
      const gridConfigParams = this.getPageConfigParams(gridConfig.urlKey, 'gridConfig', gridConfig);
      return this.http.put(url, gridConfigParams, { headers: headers });
    } else if (gridConfig.saveColumnsConfig) {
      const columnsConfigParams = this.getPageConfigParams(gridConfig.urlKey, 'columnsConfig', columnsConfig);
      return this.http.put(url, columnsConfigParams, { headers: headers });
    } else {
      return of(gridConfig);
    }
  }

  private getPageConfigParams(urlKey: string, configType: string, configData: object): HttpParams {
    let params = this.backendService.getParams(urlKey, 'updatePageConfig');
    params = params.append('configType', configType);
    params = params.append('configData', JSON.stringify(configData));
    return params;
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
