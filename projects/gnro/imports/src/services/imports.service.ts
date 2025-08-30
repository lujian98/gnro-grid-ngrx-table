import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GnroBackendService, GnroUploadFile } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '@gnro/ui/file-upload';

@Injectable({
  providedIn: 'root',
})
export class GnroImportsService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  importsFile(fileUploadConfig: GnroFileUploadConfig, file: GnroUploadFile): Observable<object> {
    const url = this.backendService.apiUrl;
    const formData = this.backendService.getFormData(fileUploadConfig.urlKey, 'imports');
    formData.append('importsfile', file.fieldName);
    if (file.relativePath) {
      formData.append(file.fieldName, file.file, file.relativePath);
    } else {
      formData.append(file.fieldName, file.file);
    }
    /*
    files.forEach((file) => {
      formData.append('filelist[]', file.fieldName);
      if (file.relativePath) {
        formData.append(file.fieldName, file.file, file.relativePath);
      } else {
        formData.append(file.fieldName, file.file);
      }
    });
    */
    return this.http.post(url, formData).pipe(
      map((res) => {
        return {
          res,
        };
      }),
    );
  }
}
