import { Injectable, inject } from '@angular/core';
import { GnroMessageComponent, defaultMessageConfig, GnroMessageActions } from '@gnro/ui/message';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map, mergeMap, of } from 'rxjs';
import { GnroRemoteResponse } from '../models/remote.model';
import { GnroRemoteDeleteService } from '../services/delete.service';
import {
  applyDeleteConfirmationAction,
  closeDeleteConfirmationAction,
  deleteSelectedSucessfulAction,
  openDeleteConfirmationAction,
} from './delete.actions';

@Injectable()
export class GnroRemoteDeleteEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  private readonly remoteDeleteService = inject(GnroRemoteDeleteService);

  //TODO i18n
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
      map((data) => {
        if (data === undefined) {
          return closeDeleteConfirmationAction();
        }
        return applyDeleteConfirmationAction(data as { stateId: string; keyName: string; selected: unknown[] });
      }),
    ),
  );

  applyDeleteConfirmationAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyDeleteConfirmationAction),
      mergeMap(({ stateId, keyName, selected }) => {
        return this.remoteDeleteService.delete(stateId, keyName, selected).pipe(
          map((res: GnroRemoteResponse[]) => {
            const { stateId, keyName } = res[0];
            return deleteSelectedSucessfulAction({ stateId, keyName });
          }),
        );
      }),
    ),
  );

  //TODO i18n
  deleteSelectedSucessfulAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSelectedSucessfulAction),
      concatMap(({ stateId, keyName }) =>
        of({ stateId, keyName }).pipe(
          map(() => GnroMessageActions.show({ action: 'Delete', keyName: keyName, configType: '' })),
        ),
      ),
    ),
  );
}
