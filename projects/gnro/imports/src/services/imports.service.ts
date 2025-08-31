import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService, GnroUploadFile, ACCEPT_JSON_API_HEADER } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { Observable, map } from 'rxjs';
import { GnroImportsResponse } from '../models/imports.model';

@Injectable({
  providedIn: 'root',
})
export class GnroImportsService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  importsFile(importsFileConfig: GnroFileUploadConfig, file: GnroUploadFile): Observable<GnroImportsResponse> {
    const url = this.backendService.apiUrl;
    const formData = this.backendService.getFormData(importsFileConfig.urlKey, 'imports');
    formData.append('importsfile', file.fieldName);
    if (file.relativePath) {
      formData.append(file.fieldName, file.file, file.relativePath);
    } else {
      formData.append(file.fieldName, file.file);
    }
    return this.http.post<GnroImportsResponse>(url, formData).pipe(
      map((res) => {
        console.log(' imports res=', res);
        return res;
      }),
    );
  }

  saveImportsRecords(urlKey: string, records: object[]): Observable<any> {
    const headers = new HttpHeaders(ACCEPT_JSON_API_HEADER);
    let params = this.backendService.getParams(urlKey, 'saveImportsRecords');
    const url = this.backendService.apiUrl;
    params = params.append('formData', JSON.stringify(records));
    return this.http.put<any>(url, params, { headers: headers }).pipe(
      map((response) => {
        console.log(' saveImportsRecords res=', response);
        return {
          formData: { ...response.formData },
        };
      }),
    );
  }
}
