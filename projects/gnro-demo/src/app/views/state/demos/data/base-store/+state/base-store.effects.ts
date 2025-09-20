import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { AppBaseStoreService } from '../services/base-store.service';
import { appBaseStoreActions } from './base-store.actions';

@Injectable()
export class AppBaseStoreEffects {
  private actions$ = inject(Actions);
  private appBaseStoreService = inject(AppBaseStoreService);

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appBaseStoreActions.loadData),
      concatMap(() => {
        return this.appBaseStoreService.loadData().pipe(
          map((res) => {
            return appBaseStoreActions.loadDataSuccess({ data: res });
          }),
        );
      }),
    ),
  );

  reloadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appBaseStoreActions.reloadData),
      concatMap(() => {
        return this.appBaseStoreService.loadData().pipe(
          map((res) => {
            return appBaseStoreActions.loadDataSuccess({ data: res });
          }),
        );
      }),
    ),
  );
}
