import { Injectable, inject } from '@angular/core';
import { openToastMessageAction } from '@gnro/ui/message';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { GnroSystemPageConfigService } from '../services/system-page-config.service';
import { updateSystemPageConfigConfigAction } from './system-page-config.actions';

@Injectable()
export class GnroSystemPageConfigEffects {
  private readonly actions$ = inject(Actions);
  private readonly systemPageConfigService = inject(GnroSystemPageConfigService);

  updateSystemPageConfigConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSystemPageConfigConfigAction),
      concatMap(({ keyName, configType, configData }) => {
        return this.systemPageConfigService.systemPageConfig(keyName, configType, configData).pipe(
          map(() => {
            return openToastMessageAction({ action: 'Update', keyName, configType });
          }),
        );
      }),
    ),
  );
}
