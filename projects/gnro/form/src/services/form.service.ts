import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { GnroBackendService, GnroUploadFile } from '@gnro/ui/core';
import { GnroFormConfig } from '../models/form.model';
import { GnroFormField } from '@gnro/ui/fields';

@Injectable({
  providedIn: 'root',
})
export class GnroFormService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  getRemoteFormConfig(formConfig: GnroFormConfig): Observable<GnroFormConfig> {
    const params = this.backendService.getParams(formConfig.urlKey, 'formConfig');
    const url = this.backendService.apiUrl;
    return this.http.get<GnroFormConfig>(url, { params }).pipe(
      map((res) => {
        return {
          ...formConfig,
          ...res,
        };
      }),
    );
  }

  getFormFieldsConfig(formConfig: GnroFormConfig): Observable<GnroFormField[]> {
    const params = this.backendService.getParams(formConfig.urlKey, 'formFields');
    const url = this.backendService.apiUrl;
    return this.http.get<GnroFormField[]>(url, { params }).pipe(
      map((res) => {
        return [...res];
      }),
    );
  }

  getFormData(formConfig: GnroFormConfig): Observable<{ formConfig: GnroFormConfig; formData: object }> {
    const params = this.backendService.getParams(formConfig.urlKey, 'formData');
    const url = this.backendService.apiUrl;
    return this.http.get<{ formConfig: GnroFormConfig; formData: object }>(url, { params }).pipe(
      map((res) => {
        return {
          formConfig: { ...formConfig, ...res.formConfig },
          formData: { ...res.formData },
        };
      }),
    );
  }

  saveFormData(
    formConfig: GnroFormConfig,
    formData: object,
  ): Observable<{ formConfig: GnroFormConfig; formData: object }> {
    const params = this.backendService.getParams(formConfig.urlKey, 'saveFormData');
    const url = this.backendService.apiUrl;
    console.log(' save url=', url, ' params=', params, ' formData=', formData);
    return this.http.put<{ formConfig: GnroFormConfig; formData: object }>(url, { params }).pipe(
      map((res) => {
        console.log(' res=', res);
        return {
          formConfig: { ...formConfig, ...res.formConfig },
          formData: { ...formData },
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
