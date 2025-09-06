import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { GnroFileUploadService } from '../services/file-upload.service';
import { fileUploadActions } from './file-upload.actions';
import { GnroFileUploadFacade } from './file-upload.facade';

@Injectable()
export class GnroFileUploadEffects {
  private actions$ = inject(Actions);
  private fileUploadService = inject(GnroFileUploadService);
  private fileUploadFacade = inject(GnroFileUploadFacade);

  uploadFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fileUploadActions.upload),
      concatMap((action) => {
        const uploadFiles = this.fileUploadFacade.getUploadFiles$();
        return this.fileUploadService.sendUploadFiles(action.fileUploadConfig, uploadFiles).pipe(
          map(() => {
            return fileUploadActions.uploadSuccess();
          }),
        );
      }),
    ),
  );
}
