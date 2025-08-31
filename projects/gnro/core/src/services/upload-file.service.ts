import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GnroBackendService } from '../backend/services/backend.service';

export interface GnroUploadFile {
  fieldName: string;
  relativePath?: string;
  file: File;
  filename?: string;
  type?: string;
  size?: number;
  lastModified?: number;
}

/*
export interface GnroFileUpload extends GnroUploadFile {
  filename: string;
  type: string;
  size: number;
  lastModified: number;
}
  */
@Injectable({
  providedIn: 'root',
})
export class GnroUploadFileService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  private _uploadFiles: GnroUploadFile[] = [];
  // private uploadFiles = new BehaviorSubject<GnroUploadFile[] | null>(null);
  // uploadFiles$ = this.uploadFiles.asObservable();

  set uploadFiles(files: GnroUploadFile[]) {
    this._uploadFiles = files;
  }
  get uploadFiles(): GnroUploadFile[] {
    return this._uploadFiles;
  }

  formUploadFileChanged(fieldName: string, file: File | null): void {
    this.uploadFiles = this.uploadFiles.filter((file) => file.fieldName !== fieldName);
    if (file) {
      this.uploadFiles = [
        ...this.uploadFiles,
        {
          fieldName: fieldName,
          file: file,
        },
      ];
    }
  }

  /*
  sendFormUploadFiles(urlKey: string, files: GnroUploadFile[]): Observable<oject> {
    const url = this.backendService.apiUrl;
    const formData = this.backendService.getFormData(urlKey, 'uploadFiles');
    files.forEach((file) => {
      formData.append('filelist[]', file.fieldName);
      formData.append(file.fieldName, file.file, file.relativePath);
    });
    console.log(' send upload file=', urlKey, ' file=', files);
    //TODO response ???
    return this.http.post(url, formData).pipe(
      map((res) => {
        return {
          res,
        };
      }),
    );
  }*/
}
