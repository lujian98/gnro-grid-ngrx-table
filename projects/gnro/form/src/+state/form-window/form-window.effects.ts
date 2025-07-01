import { Injectable, inject } from '@angular/core';
import { GnroDialogService } from '@gnro/ui/overlay';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { GnroFormWindowComponent } from '../../form-window.component';
import * as formWindowActions from './form-window.actions';

@Injectable()
export class GnroFormWindowEffects {
  private readonly actions$ = inject(Actions);
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
}
