import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GnroBackendService, GnroUploadFile } from '@gnro/ui/core';
import { GnroFileUploadConfig } from '../models/file-upload.model';

@Injectable({
  providedIn: 'root',
})
export class GnroFileUploadService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  sendUploadFiles(fileUploadConfig: GnroFileUploadConfig, files: GnroUploadFile[]): Observable<object> {
    const url = this.backendService.apiUrl;
    const formData = this.backendService.getFormData(fileUploadConfig.urlKey, 'uploadFiles');
    files.forEach((file) => {
      formData.append('filelist[]', file.fieldName);
      if (file.relativePath) {
        formData.append(file.fieldName, file.file, file.relativePath);
      } else {
        formData.append(file.fieldName, file.file);
      }
    });
    return this.http.post(url, formData).pipe(
      map((res) => {
        return {
          res,
        };
      }),
    );
  }
}
