import { Injectable, inject } from '@angular/core';
import { saveFormDataSuccess } from '@gnro/ui/form';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, exhaustMap, map, of } from 'rxjs';
import { GnroFormWindowComponent } from '../form-window.component';
import * as formWindowActions from './form-window.actions';
import { selectFormWindowId } from './form-window.selectors';

@Injectable()
export class GnroFormWindowEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly dialogService = inject(GnroDialogService);

  openGridFormWindow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formWindowActions.openFormWindowDialog),
      exhaustMap(({ formWindowConfig }) => {
        const dialogRef = this.dialogService.open(GnroFormWindowComponent, {
          context: formWindowConfig,
          closeOnBackdropClick: false,
        });
        return dialogRef.onClose;
      }),
      map((values) => {
        if (values === undefined) {
          return formWindowActions.closeFormWindowDialog();
        }
        return formWindowActions.applyFormWindowDialogChanges({ values: values as object });
      }),
    ),
  );

  clearFormDataStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveFormDataSuccess),
      concatMap(({ formData }) =>
        of({ formData }).pipe(
          map(({ formData }) => {
            const formWindowId = this.store.selectSignal(selectFormWindowId)();
            console.log('formWindowId=', formWindowId);
            return formWindowActions.savedFormWindowData({ formWindowId, formData });
          }),
        ),
      ),
    ),
  );
}
