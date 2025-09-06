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
      ofType(selectFieldActions.loadRemoteFieldConfig),
      concatMap(({ fieldId, fieldConfig }) => {
        return this.selectfieldService.getRemoteFieldConfig(fieldConfig).pipe(
          map((fieldConfig) => {
            this.store.dispatch(selectFieldActions.loadFieldConfigSuccess({ fieldId, fieldConfig }));
            return selectFieldActions.loadSelectFieldOptions({ fieldId, fieldConfig });
          }),
        );
      }),
    ),
  );

  loadSelectFieldOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectFieldActions.loadSelectFieldOptions),
      concatMap(({ fieldId, fieldConfig }) => {
        return this.selectfieldService.getSelectFieldOptions(fieldConfig).pipe(
          map((options) => {
            return selectFieldActions.loadSelectFieldOptionsSuccess({ fieldId, options });
          }),
        );
      }),
    ),
  );

  clearSelectFieldStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectFieldActions.clearSelectFieldStore),
      delay(250), // wait 250 after destory the component to clear data store
      mergeMap(({ fieldId }) =>
        of(fieldId).pipe(map((fieldId) => selectFieldActions.removeSelectFieldStore({ fieldId }))),
      ),
    ),
  );
}
