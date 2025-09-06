import { Injectable, inject } from '@angular/core';
import { GnroMessageActions } from '@gnro/ui/message';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map, of } from 'rxjs';
import { GnroImportsComponent } from '../imports.component';
import { GnroImportsService } from '../services/imports.service';
import { importsActions } from './imports.actions';

@Injectable()
export class GnroRemoteImportsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  private readonly importsService = inject(GnroImportsService);

  openRemoteImportsWindowAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(importsActions.openWindow),
      exhaustMap((action) => {
        const dialogRef = this.dialogService.open(GnroImportsComponent, {
          context: { urlKey: action.urlKey },
          closeOnBackdropClick: false,
        });
        return dialogRef.onClose;
      }),
      map(() => {
        return importsActions.closeWindow();
      }),
    ),
  );

  importsFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(importsActions.importsFile),
      concatMap((action) => {
        return this.importsService.importsFile(action.importsFileConfig, action.file).pipe(
          map((importsResponse) => {
            return importsActions.importsFileSuccess({ importsResponse });
          }),
        );
      }),
    ),
  );

  saveImportsRecordsAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(importsActions.saveRecords),
      concatMap((action) => {
        return this.importsService.saveImportsRecords(action.urlKey, action.records).pipe(
          map(() => {
            return importsActions.saveRecordsSuccess({ urlKey: action.urlKey });
          }),
        );
      }),
    ),
  );

  saveImportsRecordsSuccessAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(importsActions.saveRecordsSuccess),
      concatMap(({ urlKey }) =>
        of(urlKey).pipe(
          map(() => {
            return GnroMessageActions.show({ action: 'Imports', keyName: urlKey, configType: 'Excel Data' });
          }),
        ),
      ),
    ),
  );
}
