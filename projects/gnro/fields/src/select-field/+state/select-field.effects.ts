import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, delay, map, mergeMap, of } from 'rxjs';
import { GnroSelectFieldService } from '../services/select-field.service';
import { selectFieldActions } from './select-field.actions';

@Injectable()
export class GnroSelectFieldEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly selectfieldService = inject(GnroSelectFieldService);

  getRemoteFieldConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectFieldActions.loadRemoteConfig),
      concatMap(({ fieldId, fieldConfig }) => {
        return this.selectfieldService.getRemoteConfig(fieldConfig).pipe(
          map((fieldConfig) => {
            this.store.dispatch(selectFieldActions.loadConfigSuccess({ fieldId, fieldConfig }));
            return selectFieldActions.loadOptions({ fieldId, fieldConfig });
          }),
        );
      }),
    ),
  );

  loadSelectFieldOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectFieldActions.loadOptions),
      concatMap(({ fieldId, fieldConfig }) => {
        return this.selectfieldService.getOptions(fieldConfig).pipe(
          map((options) => {
            return selectFieldActions.loadOptionsSuccess({ fieldId, options });
          }),
        );
      }),
    ),
  );

  clearSelectFieldStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectFieldActions.clearStore),
      delay(250), // wait 250 after destory the component to clear data store
      mergeMap(({ fieldId }) => of(fieldId).pipe(map((fieldId) => selectFieldActions.removeStore({ fieldId })))),
    ),
  );
}
