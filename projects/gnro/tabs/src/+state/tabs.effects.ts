import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, delay, map, mergeMap, of } from 'rxjs';
import { GnroTabsService } from '../services/tabs.service';
import { tabsActions } from './tabs.actions';

@Injectable()
export class GnroTabsEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private tabsService = inject(GnroTabsService);

  getRemoteTabsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tabsActions.loadConfig),
      concatMap(({ tabsId, tabsConfig }) => {
        return this.tabsService.getRemoteTabsConfig(tabsConfig).pipe(
          map((tabsConfig) => {
            return tabsActions.loadConfigSuccess({ tabsId, tabsConfig });
          }),
        );
      }),
    ),
  );
  // TODO load remote saveed tile

  clearTabsStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tabsActions.clearStore),
      delay(250), // wait 250 after destory the component to clear data store
      mergeMap(({ tabsId }) => of(tabsId).pipe(map((tabsId) => tabsActions.removeStore({ tabsId })))),
    ),
  );
}
