import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs';
import { AppStoreService } from '../services/app-store.service';
import { appStoreActions } from './app-store.actions';

@Injectable()
export class AppStoreEffects {
  //effects can be standalone or extends base effect
  private actions$ = inject(Actions);
  private appStoreService = inject(AppStoreService);

  refreshData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appStoreActions.refreshData),
      concatMap(() => {
        return this.appStoreService.refreshData().pipe(
          map((res) => {
            return appStoreActions.refreshDataSuccess({ data: res });
          }),
        );
      }),
    ),
  );
}
