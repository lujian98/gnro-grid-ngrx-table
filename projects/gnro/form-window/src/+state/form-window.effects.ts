import { Injectable, inject } from '@angular/core';
import { saveFormDataSuccess } from '@gnro/ui/form';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, exhaustMap, map, of } from 'rxjs';
import { GnroFormWindowComponent } from '../form-window.component';
import * as formWindowActions from './form-window.actions';
import { selectStateId } from './form-window.selectors';

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
        // current is use Save button save record, not use this apply action.
        return formWindowActions.applyFormWindowDialogChanges({ values: values as object });
      }),
    ),
  );

  saveFormDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveFormDataSuccess),
      concatMap(({ formConfig }) =>
        of({ formConfig }).pipe(
          map(({ formConfig }) => {
            const keyName = formConfig.urlKey;
            const stateId = this.store.selectSignal(selectStateId)();
            return formWindowActions.savedFormWindowData({ stateId, keyName });
          }),
        ),
      ),
    ),
  );
}
