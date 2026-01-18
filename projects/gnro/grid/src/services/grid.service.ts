import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ACCEPT_JSON_API_HEADER, GnroBackendService } from '@gnro/ui/core';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import {
  GnroColumnConfig,
  GnroColumnsConfigResponse,
  GnroGridConfig,
  GnroGridConfigResponse,
  GnroGridData,
} from '../models/grid.model';
import { filterHttpParams } from '../utils/filter-http-params';
import { sortHttpParams } from '../utils/sort-http-params';

@Injectable({
  providedIn: 'root',
})
export class GnroGridService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  getGridConfig(gridConfig: GnroGridConfig): Observable<GnroGridConfig> {
    let params = this.backendService.getParams(gridConfig.gridName, 'gridConfig');
    //params = params.append('useDefaultConfig', !gridConfig.saveGridConfig);
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
    let params = this.backendService.getParams(gridConfig.gridName, 'columnsConfig');
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

  saveModifiedRecords<T>(gridConfig: GnroGridConfig, modifiedRecords: T[]): Observable<T[]> {
    const params = this.backendService.getParams(gridConfig.gridName, 'update');
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
      const gridConfigParams = this.getPageConfigParams(gridConfig.gridName, 'gridConfig', gridConfig);
      const columnsConfigParams = this.getPageConfigParams(gridConfig.gridName, 'columnsConfig', columnsConfig);
      return forkJoin([
        this.http.put(url, gridConfigParams, { headers: headers }),
        this.http.put(url, columnsConfigParams, { headers: headers }),
      ]);
    } else if (gridConfig.saveGridConfig) {
      const gridConfigParams = this.getPageConfigParams(gridConfig.gridName, 'gridConfig', gridConfig);
      return this.http.put(url, gridConfigParams, { headers: headers });
    } else if (gridConfig.saveColumnsConfig) {
      const columnsConfigParams = this.getPageConfigParams(gridConfig.gridName, 'columnsConfig', columnsConfig);
      return this.http.put(url, columnsConfigParams, { headers: headers });
    } else {
      return of(gridConfig);
    }
  }

  private getPageConfigParams(gridName: string, configType: string, configData: object): HttpParams {
    let params = this.backendService.getParams(gridName, 'updatePageConfig');
    params = params.append('configType', configType);
    params = params.append('configData', JSON.stringify(configData));
    return params;
  }

  getGridData<T>(gridConfig: GnroGridConfig, columns: GnroColumnConfig[]): Observable<GnroGridData<T>> {
    let params = this.backendService.getParams(gridConfig.gridName, 'gridData');
    params = filterHttpParams(gridConfig.columnFilters, columns, params);
    params = sortHttpParams(gridConfig.sortFields, params);
    const offset = (gridConfig.page - 1) * gridConfig.pageSize;
    const limit = gridConfig.pageSize;
    params = params.append('offset', offset.toString());
    params = params.append('limit', limit.toString());
    const url = this.backendService.apiUrl;
    return this.http.get<GnroGridData<T>>(url, { params }).pipe(
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
}
