import { Injectable, inject } from '@angular/core';
import { openToastMessageAction } from '@gnro/ui/message';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map, of } from 'rxjs';
import { GnroImportsComponent } from '../imports.component';
import { GnroImportsService } from '../services/imports.service';
import {
  closeRemoteImportsWindowAction,
  importsFileAction,
  importsFileSuccessAction,
  openRemoteImportsWindowAction,
  saveImportsRecordsAction,
  saveImportsRecordsSuccessAction,
} from './imports.actions';

@Injectable()
export class GnroRemoteImportsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  private readonly importsService = inject(GnroImportsService);

  openRemoteImportsWindowAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openRemoteImportsWindowAction),
      exhaustMap((action) => {
        const dialogRef = this.dialogService.open(GnroImportsComponent, {
          context: { urlKey: action.urlKey },
          closeOnBackdropClick: false,
        });
        return dialogRef.onClose;
      }),
      map(() => {
        return closeRemoteImportsWindowAction();
      }),
    ),
  );

  importsFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(importsFileAction),
      concatMap((action) => {
        return this.importsService.importsFile(action.importsFileConfig, action.file).pipe(
          map((importsResponse) => {
            return importsFileSuccessAction({ importsResponse });
          }),
        );
      }),
    ),
  );

  saveImportsRecordsAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveImportsRecordsAction),
      concatMap((action) => {
        return this.importsService.saveImportsRecords(action.urlKey, action.records).pipe(
          map(() => {
            return saveImportsRecordsSuccessAction({ urlKey: action.urlKey });
          }),
        );
      }),
    ),
  );

  saveImportsRecordsSuccessAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveImportsRecordsSuccessAction),
      concatMap(({ urlKey }) =>
        of(urlKey).pipe(
          map(() => {
            return openToastMessageAction({ action: 'Imports', keyName: urlKey, configType: 'Excel Data' });
          }),
        ),
      ),
    ),
  );
}
