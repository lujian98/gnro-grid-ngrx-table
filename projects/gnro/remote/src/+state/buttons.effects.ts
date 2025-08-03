import { Injectable, inject } from '@angular/core';
import { openToastMessageAction } from '@gnro/ui/message';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { GnroRemoteButtonsService } from '../services/buttons.service';
import { buttonRemoteAction } from './buttons.actions';

@Injectable()
export class GnroRemoteButtonsEffects {
  private readonly actions$ = inject(Actions);
  private readonly remoteButtonsService = inject(GnroRemoteButtonsService);

  buttonRemoteAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(buttonRemoteAction),
      concatMap(({ button, keyName, configType, formData }) => {
        console.log(' remote button action =', button);
        return this.remoteButtonsService.remoteAction(button, keyName, configType, formData).pipe(
          map(({ keyName, configType }) => {
            return openToastMessageAction({ action: button.remoteAction!, keyName, configType });
          }),
        );
      }),
    ),
  );
}
