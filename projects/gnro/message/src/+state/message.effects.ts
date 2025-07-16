import { Injectable, inject } from '@angular/core';
import { GnroDialogService } from '@gnro/ui/overlay';
import { GnroPositionType } from '@gnro/ui/window';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime, map, of, switchMap } from 'rxjs';
import { GnroMessageComponent } from '../message.component';
import { defaultMessageConfig } from '../models/message.model';
import { sendToastMessageAction, updateToastMessageAction } from './message.actions';

@Injectable()
export class GnroMessageEffects {
  private readonly actions$ = inject(Actions);
  private readonly dialogService = inject(GnroDialogService);

  updateToastMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateToastMessageAction),
      debounceTime(100),
      switchMap((action) => {
        this.dialogService.open(GnroMessageComponent, {
          context: {
            messageConfig: {
              ...defaultMessageConfig,
              title: 'Test Message',
              showOkButton: true,
              showCancelButton: true,
              message: 'This is message to exit',
              position: GnroPositionType.TOP_MIDDLE,
              autoClose: true,
            },
          },
          hasBackdrop: false,
          closeOnBackdropClick: false,
        });
        return of(action).pipe(map(() => sendToastMessageAction()));
      }),
    ),
  );
}
