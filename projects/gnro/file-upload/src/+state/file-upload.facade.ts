import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fileUploadActions from './file-upload.actions';
import { selectUploadFiles, selectUploadFilesGridData } from './file-upload.selectors';
import { GnroFileUploadConfig } from '../models/file-upload.model';

@Injectable({ providedIn: 'root' })
export class GnroFileUploadFacade {
  private readonly store = inject(Store);
  getUploadFiles$ = this.store.selectSignal(selectUploadFiles);
  getUploadFilesGridData$ = this.store.selectSignal(selectUploadFilesGridData);

  dropUploadFile(relativePath: string, file: File): void {
    this.store.dispatch(fileUploadActions.dropUploadFile({ relativePath, file }));
  }

  selectedUploadFile(fieldName: string, file: File | null): void {
    if (file) {
      this.store.dispatch(fileUploadActions.selectedUploadFile({ fieldName, file }));
    } else {
      this.store.dispatch(fileUploadActions.clearSelectedUploadFile({ fieldName }));
    }
  }

  uploadFiles(fileUploadConfig: GnroFileUploadConfig): void {
    this.store.dispatch(fileUploadActions.uploadFiles({ fileUploadConfig }));
  }

  clearUploadFiles(): void {
    this.store.dispatch(fileUploadActions.clearUploadFiles());
  }
}
