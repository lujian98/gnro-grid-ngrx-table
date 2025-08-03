import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroMessageComponent, defaultMessageConfig } from '@gnro/ui/message';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map } from 'rxjs';
import { GnroRemoteExportsService } from '../services/exports.service';
import {
  closeRemoteExportsWindowAction,
  openRemoteExportsWindowAction,
  remoteExportFileSuccessAction,
  startRemoteExportsAction,
} from './exports.actions';

@Injectable()
export class GnroRemoteExportsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  private readonly remoteExportsService = inject(GnroRemoteExportsService);

  openRemoteExportsWindowAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openRemoteExportsWindowAction),
      exhaustMap((action) => {
        const params = action.params;
        const dialogRef = this.dialogService.open(GnroMessageComponent, {
          context: {
            messageConfig: {
              ...defaultMessageConfig,
              title: 'Export',
              showOkButton: true,
              ok: 'Yes',
              showCancelButton: true,
              message: 'Are you sure you want export grid data selected?',
            },
            data: { params },
          },
          hasBackdrop: false,
          closeOnBackdropClick: false,
        });
        return dialogRef.onClose;
      }),
      map((data) => {
        if (data === undefined) {
          return closeRemoteExportsWindowAction();
        }
        return startRemoteExportsAction(data as { params: HttpParams });
      }),
    ),
  );

  startRemoteExportsAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startRemoteExportsAction),
      concatMap((action) => {
        console.log(' 2222action.params= ', action.params);
        return this.remoteExportsService.exports(action.params).pipe(
          map((response) => {
            console.log(' 3333333 response=', response);
            const contentDisposition = response.headers.get('Content-Disposition');
            console.log(' 333333 contentDisposition=', contentDisposition);

            let filename = 'download-file.xls';

            if (contentDisposition) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              const matches = filenameRegex.exec(contentDisposition);
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
              }
            }

            const blob = new Blob([response.body as BlobPart], {
              type: response.headers.get('Content-Type') || undefined,
            });
            const url = window.URL.createObjectURL(blob);
            const element = document.createElement('a');
            element.download = filename;
            element.href = url;
            element.click();

            return remoteExportFileSuccessAction();
          }),
        );
      }),
    ),
  );

  /*
        // Using file-saver library for robust file saving
      saveAs(blob, filename);
 
      // Alternatively, using native browser download (less robust for older browsers)
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = filename;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
      */
}
