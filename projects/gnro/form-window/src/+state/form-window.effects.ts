import { Injectable, inject } from '@angular/core';
import { formActions } from '@gnro/ui/form';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, exhaustMap, map, of } from 'rxjs';
import { GnroFormWindowComponent } from '../form-window.component';
import { formWindowActions } from './form-window.actions';
import { selectStateId } from './form-window.selectors';

@Injectable()
export class GnroFormWindowEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly dialogService = inject(GnroDialogService);

  openFormWindow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formWindowActions.open),
      exhaustMap(({ formWindowConfig }) => {
        const dialogRef = this.dialogService.open(GnroFormWindowComponent, {
          context: formWindowConfig,
          closeOnBackdropClick: false,
        });
        return dialogRef.onClose;
      }),
      map((values) => {
        //if (values === undefined) {
        //  return formWindowActions.close();
        //}
        return formWindowActions.close();
        // current is use Save button save record, not use this apply action.
        //return formWindowActions.save({ values });
      }),
    ),
  );

  saveFormWindowDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.saveData),
      concatMap(({ formConfig }) =>
        of({ formConfig }).pipe(
          map(({ formConfig }) => {
            const keyName = formConfig.urlKey;
            const stateId = this.store.selectSignal(selectStateId)();
            return formWindowActions.saveSuccess({ stateId, keyName });
          }),
        ),
      ),
    ),
  );
}
