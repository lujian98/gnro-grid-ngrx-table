import { Injectable, inject } from '@angular/core';
import { GnroFileUploadService } from '../services/file-upload.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { concatMap, map } from 'rxjs';
import * as fileUploadActions from './file-upload.actions';
import { GnroFileUploadFacade } from './file-upload.facade';

@Injectable()
export class GnroFileUploadEffects {
  private actions$ = inject(Actions);
  private fileUploadService = inject(GnroFileUploadService);
  private fileUploadFacade = inject(GnroFileUploadFacade);

  uploadFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fileUploadActions.uploadFiles),
      concatLatestFrom(() => {
        return [this.fileUploadFacade.selectUploadFiles$];
      }),
      concatMap(([action, uploadFiles]) => {
        return this.fileUploadService.sendUploadFiles(action.fileUploadConfig, uploadFiles).pipe(
          map(() => {
            return fileUploadActions.uploadFilesSuccess();
          }),
        );
      }),
    ),
  );
}
