import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, of } from 'rxjs';
import { GnroTabsService } from '../services/tabs.service';
import { tabsActions } from './tabs.actions';

@Injectable()
export class GnroTabsEffects {
  private readonly actions$ = inject(Actions);
  private readonly tabsService = inject(GnroTabsService);

  getRemoteTabsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tabsActions.loadConfig),
      concatMap(({ tabsName, tabsConfig }) => {
        return this.tabsService.getRemoteTabsConfig(tabsConfig).pipe(
          map((tabsConfig) => {
            return tabsActions.loadConfigSuccess({ tabsName, tabsConfig });
          }),
        );
      }),
    ),
  );
  // TODO load remote saved tabs

  clearTabsStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tabsActions.clearStore),
      concatMap(({ tabsName }) => of(tabsActions.removeStore({ tabsName }))),
    ),
  );
}
