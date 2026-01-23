import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, map, mergeMap, of } from 'rxjs';
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
      concatMap(({ fieldName, fieldConfig }) => {
        return this.selectfieldService.getRemoteConfig(fieldConfig).pipe(
          map((fieldConfig) => {
            this.store.dispatch(selectFieldActions.loadConfigSuccess({ fieldName, fieldConfig }));
            return selectFieldActions.loadOptions({ fieldName, fieldConfig });
          }),
        );
      }),
    ),
  );

  loadSelectFieldOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectFieldActions.loadOptions),
      concatMap(({ fieldName, fieldConfig }) => {
        return this.selectfieldService.getOptions(fieldConfig).pipe(
          map((options) => {
            return selectFieldActions.loadOptionsSuccess({ fieldName, options });
          }),
        );
      }),
    ),
  );

  clearSelectFieldStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectFieldActions.clearStore),
      mergeMap(({ fieldName }) =>
        of(fieldName).pipe(map((fieldName) => selectFieldActions.removeStore({ fieldName }))),
      ),
    ),
  );
}
