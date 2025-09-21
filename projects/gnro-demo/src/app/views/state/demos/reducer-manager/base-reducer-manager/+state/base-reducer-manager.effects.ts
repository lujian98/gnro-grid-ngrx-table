import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, map } from 'rxjs';
import { BaseReducerManagerService } from '../services/base-reducer-manager.service';
import { baseReducerManagerActions } from './base-reducer-manager.actions';
import { selectConfig } from './base-reducer-manager.selectors';

@Injectable()
export class BaseReducerManagerEffects {
  private actions$ = inject(Actions);
  private readonly store = inject(Store);
  private baseReducerManagerService = inject(BaseReducerManagerService);

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(baseReducerManagerActions.loadData),
      concatMap((action) => {
        const config = this.store.selectSignal(selectConfig(action.featureName));
        return this.baseReducerManagerService.loadData(config()).pipe(
          map((res) => {
            return baseReducerManagerActions.loadDataSuccess({ data: res });
          }),
        );
      }),
    ),
  );

  reloadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(baseReducerManagerActions.reloadData),
      concatMap((action) => {
        const config = this.store.selectSignal(selectConfig(action.featureName));
        return this.baseReducerManagerService.loadData(config()).pipe(
          map((res) => {
            return baseReducerManagerActions.loadDataSuccess({ data: res });
          }),
        );
      }),
    ),
  );
}
