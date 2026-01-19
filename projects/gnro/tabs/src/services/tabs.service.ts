import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GnroBackendService } from '@gnro/ui/core';
import { GnroTabsConfig, GnroTabConfig, GnroTabsConfigResponse } from '../models/tabs.model';

@Injectable({
  providedIn: 'root',
})
export class GnroTabsService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  getRemoteTabsConfig(tabsConfig: GnroTabsConfig): Observable<GnroTabsConfig> {
    const params = this.backendService.getParams(tabsConfig.urlKey, 'tabsConfig', tabsConfig.tabsName);
    const url = this.backendService.apiUrl;
    return this.http.get<GnroTabsConfigResponse>(url, { params }).pipe(
      map((config) => {
        return {
          ...tabsConfig,
          ...config.tabsConfig,
        };
      }),
    );
  }

  /*
  //NOT used
  getTabsOptions(tabsConfig: GnroTabsConfig): Observable<GnroTabConfig[]> {
    const params = this.backendService.getParams(tabsConfig.urlKey, 'select', tabsConfig.name);
    const url = this.backendService.apiUrl;
    return this.http.get<GnroTabConfig[]>(url, { params }).pipe(
      map((options) => {
        return options;
      }),
    );
  }
    */
}
