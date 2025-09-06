import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { fileUploadActions } from './file-upload.actions';
import { selectUploadFiles, selectUploadFilesGridData } from './file-upload.selectors';
import { GnroFileUploadConfig } from '../models/file-upload.model';

@Injectable({ providedIn: 'root' })
export class GnroFileUploadFacade {
  private readonly store = inject(Store);
  getUploadFiles$ = this.store.selectSignal(selectUploadFiles);
  getUploadFilesGridData$ = this.store.selectSignal(selectUploadFilesGridData);

  dropFile(relativePath: string, file: File): void {
    this.store.dispatch(fileUploadActions.dropFile({ relativePath, file }));
  }

  selectFile(fieldName: string, file: File | null): void {
    if (file) {
      this.store.dispatch(fileUploadActions.selectFile({ fieldName, file }));
    } else {
      this.store.dispatch(fileUploadActions.clearSelectedFile({ fieldName }));
    }
  }

  upload(fileUploadConfig: GnroFileUploadConfig): void {
    this.store.dispatch(fileUploadActions.upload({ fileUploadConfig }));
  }

  clearFiles(): void {
    this.store.dispatch(fileUploadActions.clearFiles());
  }
}
