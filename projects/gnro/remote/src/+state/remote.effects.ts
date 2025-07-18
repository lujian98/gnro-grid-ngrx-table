import { Injectable, inject } from '@angular/core';
import { GnroMessageComponent, defaultMessageConfig, updateToastMessageAction } from '@gnro/ui/message';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map, mergeMap, of } from 'rxjs';
import { GnroRemoteService } from '../services/remote.service';
import {
  applyDeleteConfirmationAction,
  buttonRemoteAction,
  closeDeleteConfirmationAction,
  deleteSelectedSucessfulAction,
  openDeleteConfirmationAction,
} from './remote.actions';

@Injectable()
export class GnroButtonEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  private readonly remoteService = inject(GnroRemoteService);

  openDeleteConfirmationWindow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openDeleteConfirmationAction),
      exhaustMap(({ stateId, keyName, selected }) => {
        const dialogRef = this.dialogService.open(GnroMessageComponent, {
          context: {
            messageConfig: {
              ...defaultMessageConfig,
              title: 'DELETE',
              showOkButton: true,
              ok: 'Yes',
              showCancelButton: true,
              message: 'Are you sure you want delete selected?',
            },
            data: { stateId, keyName, selected },
          },
          hasBackdrop: false,
          closeOnBackdropClick: false,
        });
        return dialogRef.onClose;
      }),
      map((data: any) => {
        if (data === undefined) {
          return closeDeleteConfirmationAction();
        }
        console.log('stateId, selected=', data);
        return applyDeleteConfirmationAction(data);
      }),
    ),
  );

  applyDeleteConfirmationAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyDeleteConfirmationAction),
      mergeMap(({ stateId, keyName, selected }) => {
        return this.remoteService.delete(stateId, keyName, selected).pipe(
          map((res: any[]) => {
            console.log(' deleted stateId=', res);
            const { stateId, keyName } = res[0];
            return deleteSelectedSucessfulAction({ stateId, keyName });
          }),
        );
      }),
    ),
  );

  deleteSelectedSucessfulAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSelectedSucessfulAction),
      concatMap(({ stateId, keyName }) =>
        of({ stateId, keyName }).pipe(
          map(() => updateToastMessageAction({ action: 'Delete', keyName: keyName, configType: '' })),
        ),
      ),
    ),
  );

  buttonRemoteAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(buttonRemoteAction),
      concatMap(({ button, keyName, configType, formData }) => {
        console.log(' remote button action =', button);
        return this.remoteService.remoteAction(button, keyName, configType, formData).pipe(
          map(({ keyName, configType }) => {
            return updateToastMessageAction({ action: button.remoteAction!, keyName, configType });
          }),
        );
      }),
    ),
  );
}
