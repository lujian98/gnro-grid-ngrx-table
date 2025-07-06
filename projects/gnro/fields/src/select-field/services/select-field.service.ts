import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GnroBackendService } from '@gnro/ui/core';
import { GnroSelectFieldConfig, GnroOptionType } from '../models/select-field.model';
import { GnroFieldConfigResponse } from '../../models/fields.model';

@Injectable({
  providedIn: 'root',
})
export class GnroSelectFieldService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  getRemoteFieldConfig(fieldConfig: GnroSelectFieldConfig): Observable<GnroSelectFieldConfig> {
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

  getSelectFieldOptions(fieldConfig: GnroSelectFieldConfig): Observable<GnroOptionType[]> {
    const params = this.backendService.getParams(fieldConfig.urlKey, 'select', fieldConfig.fieldName);
    const url = this.backendService.apiUrl;
    return this.http.get<GnroOptionType[]>(url, { params }).pipe(
      map((options) => {
        return options;
      }),
    );
  }
}
