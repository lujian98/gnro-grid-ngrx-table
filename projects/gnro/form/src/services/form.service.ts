import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ACCEPT_JSON_API_HEADER, GnroBackendService, GnroDataType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { Observable, map } from 'rxjs';
import {
  GnroFormConfig,
  GnroFormConfigResponse,
  GnroFormFieldsResponse,
  GnroFormRecordResponse,
} from '../models/form.model';

@Injectable({
  providedIn: 'root',
})
export class GnroFormService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  getRemoteFormConfig(formConfig: GnroFormConfig): Observable<GnroFormConfig> {
    const params = this.backendService.getParams(formConfig.urlKey, 'formConfig');
    const url = this.backendService.apiUrl;
    return this.http.get<GnroFormConfigResponse>(url, { params }).pipe(
      map((config) => {
        return {
          ...formConfig,
          ...config.formConfig,
        };
      }),
    );
  }

  getFormFieldsConfig(formConfig: GnroFormConfig): Observable<GnroFormField[]> {
    const params = this.backendService.getParams(formConfig.urlKey, 'formFields');
    const url = this.backendService.apiUrl;
    return this.http.get<GnroFormFieldsResponse>(url, { params }).pipe(
      map((response) => {
        return [...response.formFields];
      }),
    );
  }

  getFormData(formConfig: GnroFormConfig): Observable<{ formConfig: GnroFormConfig; formData: GnroDataType }> {
    const params = this.backendService.getParams(formConfig.urlKey, 'formData');
    const url = this.backendService.apiUrl;
    return this.http.get<GnroFormRecordResponse>(url, { params }).pipe(
      map((response) => {
        return {
          formConfig: { ...formConfig },
          formData: { ...response.formData },
        };
      }),
    );
  }

  saveFormData(
    formConfig: GnroFormConfig,
    formData: GnroDataType,
  ): Observable<{ formConfig: GnroFormConfig; formData: GnroDataType }> {
    const headers = new HttpHeaders(ACCEPT_JSON_API_HEADER);

    let params = this.backendService.getParams(formConfig.urlKey, 'update');
    const url = this.backendService.apiUrl;
    params = params.append('formData', JSON.stringify(formData));
    return this.http.put<GnroFormRecordResponse>(url, params, { headers: headers }).pipe(
      map((response) => {
        console.log(' res=', response);
        return {
          formConfig: { ...formConfig },
          formData: { ...response.formData },
        };
      }),
    );
  }

  /*
  uploadFiles(formConfig: GnroFormConfig, files: GnroUploadFile[]): Observable<{ formConfig: GnroFormConfig }> {
    const url = this.backendService.apiUrl;
    const formData = this.backendService.getFormData(formConfig.urlKey, 'uploadFiles');
    files.forEach((file) => {
      formData.append('filelist[]', file.fieldName);
      formData.append(file.fieldName, file.file);
    });
    //console.log(' url =', url);
    return this.http.post<{ formConfig: GnroFormConfig }>(url, formData).pipe(
      map((res) => {
        //console.log(' formData res=', res);
        return {
          formConfig: { ...formConfig },
        };
      }),
    );
  }*/
}
