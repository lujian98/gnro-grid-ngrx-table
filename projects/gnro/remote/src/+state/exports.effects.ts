import { Injectable, inject } from '@angular/core';
import { GnroMessageComponent, defaultMessageConfig, openToastMessageAction } from '@gnro/ui/message';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map, mergeMap, of } from 'rxjs';
import { GnroRemoteResponse } from '../models/remote.model';
import { GnroRemoteExportsService } from '../services/exports.service';
import { openRemoteExportsWindowAction, remoteExportFileSuccessAction } from './exports.actions';

@Injectable()
export class GnroRemoteExportsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  private readonly remoteExportsService = inject(GnroRemoteExportsService);

  openRemoteExportsWindowAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openRemoteExportsWindowAction),
      exhaustMap((action) => {
        /*
        const gridId = action.gridId;
        const gridConfig = this.gridFacade.getGridConfig(gridId)();
        const columns = this.gridFacade.getColumnsConfig(gridId)();

        let params = this.backendService.getParams(gridConfig.urlKey, 'exports');
        params = filterHttpParams(gridConfig.columnFilters, columns, params);
        params = sortHttpParams(gridConfig.sortFields, params);
        */
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
