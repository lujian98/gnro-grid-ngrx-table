import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService } from '@gnro/ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GnroFieldConfigResponse } from '../../models/fields.model';
import { GnroOptionType, GnroOptionsResponse, GnroSelectFieldConfig } from '../models/select-field.model';

@Injectable({
  providedIn: 'root',
})
export class GnroSelectFieldService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  getRemoteConfig(fieldConfig: GnroSelectFieldConfig): Observable<GnroSelectFieldConfig> {
    const params = this.backendService.getParams(fieldConfig.urlKey, 'selectFieldConfig', fieldConfig.fieldName);
    const url = this.backendService.apiUrl;
    return this.http.get<GnroFieldConfigResponse>(url, { params }).pipe(
      map((config) => {
        return {
          ...fieldConfig,
          ...config.fieldConfig,
          remoteOptions: true, // remote config requires remote options
        };
      }),
    );
  }

  getOptions(fieldConfig: GnroSelectFieldConfig): Observable<GnroOptionType[]> {
    const params = this.backendService.getParams(fieldConfig.urlKey, 'select', fieldConfig.fieldName);
    const url = this.backendService.apiUrl;
    return this.http.get<GnroOptionsResponse>(url, { params }).pipe(
      map((response) => {
        return response.options;
      }),
    );
  }
}
