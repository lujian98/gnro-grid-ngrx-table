import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService, GnroUploadFile } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';
import { GnroGridData } from '@gnro/ui/grid';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GnroImportsService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  importsFile(importsFileConfig: GnroFileUploadConfig, file: GnroUploadFile): Observable<GnroGridData<object>> {
    const url = this.backendService.apiUrl;
    const formData = this.backendService.getFormData(importsFileConfig.urlKey, 'imports');
    formData.append('importsfile', file.fieldName);
    if (file.relativePath) {
      formData.append(file.fieldName, file.file, file.relativePath);
    } else {
      formData.append(file.fieldName, file.file);
    }
    return this.http.post<GnroGridData<object>>(url, formData).pipe(
      map((res) => {
        console.log(' imports res=', res);
        return res;
      }),
    );
  }
}
