import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, ReducerManager } from '@ngrx/store';
import { concatMap, delay, map, mergeMap, of } from 'rxjs';
//import { GnroDashboardService } from '../services/dashboard.service';
import { dashboardActions } from './dashboard.actions';

@Injectable()
export class GnroDashboardEffects {
  //private store = inject(Store);
  //private reducerManager = inject(ReducerManager);
  private readonly actions$ = inject(Actions);
  //private dashboardService = inject(GnroDashboardService);

  /*
  getRemoteDashboardConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardActions.loadRemoteDashboardConfig),
      concatMap(({ dashboardName, dashboardConfig }) => {
        return this.dashboardService.getRemoteDashboardConfig(dashboardConfig).pipe(
          map((dashboardConfig) => {
            this.store.dispatch(dashboardActions.loadDashboardConfigSuccess({ dashboardName, dashboardConfig }));
            return dashboardActions.loadDashboardOptions({ dashboardName, dashboardConfig });
          }),
        );
      }),
    ),
  );

  loadDashboardOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardActions.loadDashboardOptions),
      concatMap(({ dashboardName, dashboardConfig }) => {
        return this.dashboardService.getDashboardOptions(dashboardConfig).pipe(
          map((options) => {
            return dashboardActions.loadDashboardOptionsSuccess({ dashboardName, options });
          }),
        );
      }),
    ),
  );
*/

  clearDashboardStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardActions.clearStore),
      mergeMap(({ dashboardName }) =>
        of(dashboardName).pipe(map((dashboardName) => dashboardActions.removeStore({ dashboardName }))),
      ),
    ),
  );
}
