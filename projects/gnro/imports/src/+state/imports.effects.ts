import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map } from 'rxjs';
import { GnroImportsComponent } from '../components/imports/imports.component';
import { GnroImportsService } from '../services/imports.service';
import {
  closeRemoteImportsWindowAction,
  importsFileAction,
  importsFileSuccessAction,
  openRemoteImportsWindowAction,
  startRemoteImportsAction,
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
          context: { urlKey: action.keyName },
          closeOnBackdropClick: false,
        });
        return dialogRef.onClose;
      }),
      map((data) => {
        if (data === undefined) {
          return closeRemoteImportsWindowAction();
        }
        const params = data as HttpParams;
        return startRemoteImportsAction({ params });
      }),
    ),
  );

  importsFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(importsFileAction),
      concatMap((action) => {
        return this.importsService.importsFile(action.importsFileConfig, action.file).pipe(
          map(({ importedExcelData, columnsConfig }) => {
            return importsFileSuccessAction({ importedExcelData, columnsConfig });
          }),
        );
      }),
    ),
  );
}
