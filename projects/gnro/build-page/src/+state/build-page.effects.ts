import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { GnroBuildPageService } from '../services/build-page.service';
import * as buildPageActions from './build-page.actions';

@Injectable()
export class GnroBuildPageEffects {
  private readonly actions$ = inject(Actions);
  private readonly buildPageService = inject(GnroBuildPageService);

  updateBuildPageConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(buildPageActions.updateBuildPageConfig),
      concatMap(({ keyName, configType, configData }) => {
        return this.buildPageService.buildPageConfig(keyName, configType, configData).pipe(
          map(() => {
            return buildPageActions.updateBuildPageConfigSucessful();
          }),
        );
      }),
    ),
  );
}
