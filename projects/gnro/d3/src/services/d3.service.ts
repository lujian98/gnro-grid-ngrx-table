import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService } from '@gnro/ui/core';
import { Observable, map } from 'rxjs';
import {
  GnroD3ChartConfig,
  GnroD3ChartConfigsResponse,
  GnroD3Config,
  GnroD3ConfigResponse,
  GnroD3DataResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class GnroD3Service {
  private http = inject(HttpClient);
  private backendService = inject(GnroBackendService);

  getRemoteD3Config(d3Config: GnroD3Config): Observable<GnroD3Config> {
    const params = this.backendService.getParams(d3Config.urlKey, 'd3Config', d3Config.chartName);
    const url = this.backendService.apiUrl;
    return this.http.get<GnroD3ConfigResponse>(url, { params }).pipe(
      map((config) => {
        return {
          ...d3Config,
          ...config.d3Config,
        };
      }),
    );
  }

  getD3ChartConfigs(d3Config: GnroD3Config): Observable<GnroD3ChartConfig[]> {
    const params = this.backendService.getParams(d3Config.urlKey, 'd3ChartConfigs', d3Config.chartName);
    const url = this.backendService.apiUrl;
    return this.http.get<GnroD3ChartConfigsResponse>(url, { params }).pipe(
      map((response) => {
        return [...response.d3ChartConfigs];
      }),
    );
  }

  getD3Data<T>(d3Config: GnroD3Config): Observable<T[]> {
    const params = this.backendService.getParams(d3Config.urlKey, 'd3Data', d3Config.chartName);
    const url = this.backendService.apiUrl;
    return this.http.get<GnroD3DataResponse<T>>(url, { params }).pipe(
      map((response) => {
        return [...response.d3Data];
      }),
    );
  }
}
