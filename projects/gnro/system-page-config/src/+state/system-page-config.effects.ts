import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { GnroSystemPageConfigService } from '../services/system-page-config.service';
import * as systemPageConfigActions from './system-page-config.actions';

@Injectable()
export class GnroSystemPageConfigEffects {
  private readonly actions$ = inject(Actions);
  private readonly systemPageConfigService = inject(GnroSystemPageConfigService);

  updateSystemPageConfigConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(systemPageConfigActions.updateSystemPageConfigConfig),
      concatMap(({ keyName, configType, configData }) => {
        return this.systemPageConfigService.systemPageConfig(keyName, configType, configData).pipe(
          map(() => {
            return systemPageConfigActions.updateSystemPageConfigConfigSucessful();
          }),
        );
      }),
    ),
  );
}
