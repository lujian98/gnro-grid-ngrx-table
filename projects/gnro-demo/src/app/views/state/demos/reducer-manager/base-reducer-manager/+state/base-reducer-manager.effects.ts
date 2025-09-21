import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { BaseReducerManagerService } from '../services/base-reducer-manager.service';
import { baseReducerManagerActions } from './base-reducer-manager.actions';

@Injectable()
export class BaseReducerManagerEffects {
  private actions$ = inject(Actions);
  private baseReducerManagerService = inject(BaseReducerManagerService);

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(baseReducerManagerActions.loadData),
      concatMap((action) => {
        return this.baseReducerManagerService.loadData().pipe(
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
        return this.baseReducerManagerService.loadData().pipe(
          map((res) => {
            return baseReducerManagerActions.loadDataSuccess({ data: res });
          }),
        );
      }),
    ),
  );
}
