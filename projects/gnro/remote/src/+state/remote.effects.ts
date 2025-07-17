import { Injectable, inject } from '@angular/core';
import { updateToastMessageAction } from '@gnro/ui/message';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, exhaustMap, map } from 'rxjs';
import { GnroRemoteService } from '../services/remote.service';
import { GnroDialogService } from '@gnro/ui/overlay';
import {
  openDeleteConfirmationAction,
  closeDeleteConfirmationAction,
  applyDeleteConfirmationAction,
  buttonRemoteAction,
} from './remote.actions';
import { GnroMessageComponent, defaultMessageConfig } from '@gnro/ui/message';

@Injectable()
export class GnroButtonEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);
  private readonly remoteService = inject(GnroRemoteService);

  openDeleteConfirmationWindow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openDeleteConfirmationAction),
      exhaustMap(({ stateId, selected }) => {
        const dialogRef = this.dialogService.open(GnroMessageComponent, {
          context: {
            messageConfig: {
              ...defaultMessageConfig,
              title: 'Test Yes/No Message',
              showOkButton: true,
              ok: 'Yes',
              showCancelButton: true,
              //cancel: 'No',
              message: 'This is Yes/No message to close',
            },
            data: { stateId, selected },
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
