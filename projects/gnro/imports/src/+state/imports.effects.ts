import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map } from 'rxjs';
import { GnroImportsComponent } from '../components/imports/imports.component';
//import { GnroRemoteImportService } from '../services/import.service';
import {
  closeRemoteImportsWindowAction,
  openRemoteImportsWindowAction,
  //remoteExportFileSuccessAction,
  startRemoteImportsAction,
} from './imports.actions';

@Injectable()
export class GnroRemoteImportsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  //private readonly remoteImportsService = inject(GnroRemoteImportsService);

  openRemoteImportsWindowAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openRemoteImportsWindowAction),
      exhaustMap((action) => {
        const params = action.params;
        const dialogRef = this.dialogService.open(GnroImportsComponent, {
          context: { params },
          //hasBackdrop: false,
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

  /*oteImportsAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startRemoteImportsAction),
      concatMap((action) => {
        return this.remoteImportsService.imports(action.params).pipe(
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
            return remoteExportFileSuccessAction();
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
    return 'import-file.xls';
  }
    */
}
