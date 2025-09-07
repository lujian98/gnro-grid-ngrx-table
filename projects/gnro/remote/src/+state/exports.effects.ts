import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map } from 'rxjs';
import { GnroExportsComponent } from '../components/exports/exports.component';
import { GnroRemoteExportsService } from '../services/exports.service';
import { remoteExportsActions } from './exports.actions';

@Injectable()
export class GnroRemoteExportsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  private readonly remoteExportsService = inject(GnroRemoteExportsService);

  openRemoteExportsWindowAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(remoteExportsActions.open),
      exhaustMap((action) => {
        const params = action.params;
        const dialogRef = this.dialogService.open(GnroExportsComponent, {
          context: { params },
          hasBackdrop: false,
          closeOnBackdropClick: false,
        });
        return dialogRef.onClose;
      }),
      map((data) => {
        if (data === undefined) {
          return remoteExportsActions.close();
        }
        const params = data as HttpParams;
        return remoteExportsActions.start({ params });
      }),
    ),
  );

  startRemoteExportsAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(remoteExportsActions.start),
      concatMap((action) => {
        return this.remoteExportsService.exports(action.params).pipe(
          map((response) => {
            const contentDisposition = response.headers.get('Content-Disposition');
            const blob = new Blob([response.body as BlobPart], {
              type: response.headers.get('Content-Type') || undefined,
            });
            const url = window.URL.createObjectURL(blob);
            const element = document.createElement('a');
            element.download = this.exportFilename(contentDisposition);
            element.href = url;
            document.body.appendChild(element);
            element.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(element);
            return remoteExportsActions.success();
          }),
        );
      }),
    ),
  );

  private exportFilename(contentDisposition: string | null): string {
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return 'exports-file.xls';
  }
}
