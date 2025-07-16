import { Injectable, inject } from '@angular/core';
import { updateToastMessageAction } from '@gnro/ui/message';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { GnroButtonService } from '../services/button.service';
import { buttonRemoteAction } from './button.actions';

@Injectable()
export class GnroButtonEffects {
  private readonly actions$ = inject(Actions);
  private readonly buttonService = inject(GnroButtonService);

  buttonRemoteAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(buttonRemoteAction),
      concatMap(({ button, keyName, configType, formData }) => {
        console.log(' remote button action =', button);
        return this.buttonService.buttonRemoteAction(button, keyName, configType, formData).pipe(
          map(({ keyName, configType }) => {
            return updateToastMessageAction({ action: button.remoteAction!, keyName, configType });
          }),
        );
      }),
    ),
  );
}
