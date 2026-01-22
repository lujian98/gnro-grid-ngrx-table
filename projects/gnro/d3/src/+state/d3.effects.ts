import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, map, mergeMap, of } from 'rxjs';
import { GnroD3Service } from '../services/d3.service';
import { d3Actions } from './d3.actions';

@Injectable()
export class GnroD3Effects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private d3Service = inject(GnroD3Service);

  loadRemoteD3Config$ = createEffect(() =>
    this.actions$.pipe(
      ofType(d3Actions.loadConfig),
      concatMap(({ d3ChartName, d3Config }) => {
        return this.d3Service.getRemoteD3Config(d3Config).pipe(
          map((d3Config) => {
            if (d3Config.remoteChartConfigs) {
              this.store.dispatch(d3Actions.loadConfigSuccess({ d3ChartName, d3Config }));
              return d3Actions.loadChartConfigs({ d3ChartName, d3Config });
            } else {
              return d3Actions.loadConfigSuccess({ d3ChartName, d3Config });
            }
          }),
        );
      }),
    ),
  );

  loadD3ChartConfigs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(d3Actions.loadChartConfigs),
      concatMap(({ d3ChartName, d3Config }) => {
        return this.d3Service.getD3ChartConfigs(d3Config).pipe(
          map((chartConfigs) => {
            if (d3Config.remoteD3Data) {
              this.store.dispatch(d3Actions.loadChartConfigsSuccess({ d3ChartName, d3Config, chartConfigs }));
              return d3Actions.getData({ d3ChartName, d3Config });
            } else {
              return d3Actions.loadChartConfigsSuccess({ d3ChartName, d3Config, chartConfigs });
            }
          }),
        );
      }),
    ),
  );

  getD3Data$ = createEffect(() =>
    this.actions$.pipe(
      ofType(d3Actions.getData),
      concatMap(({ d3ChartName, d3Config }) => {
        return this.d3Service.getD3Data(d3Config).pipe(
          map((data) => {
            return d3Actions.getDataSuccess({ d3ChartName, d3Config, data });
          }),
        );
      }),
    ),
  );

  clearD3DataStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(d3Actions.clearStore),
      mergeMap(({ d3ChartName }) => of(d3ChartName).pipe(map((d3ChartName) => d3Actions.removeStore({ d3ChartName })))),
    ),
  );
}
