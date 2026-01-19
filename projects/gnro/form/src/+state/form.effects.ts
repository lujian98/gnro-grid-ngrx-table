import { Injectable, inject } from '@angular/core';
import { GnroUploadFileService } from '@gnro/ui/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GnroMessageActions } from '@gnro/ui/message';
import { Store } from '@ngrx/store';
import { concatMap, map, of } from 'rxjs';
import { GnroFormService } from '../services/form.service';
import { formActions } from './form.actions';

@Injectable()
export class GnroFormEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly formService = inject(GnroFormService);
  private readonly uploadFileService = inject(GnroUploadFileService);

  loadRemoteFormConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.loadConfig),
      concatMap(({ formName, formConfig }) => {
        return this.formService.getRemoteFormConfig(formConfig).pipe(
          map((formConfig) => {
            if (formConfig.remoteFieldsConfig) {
              this.store.dispatch(formActions.loadConfigSuccess({ formName, formConfig }));
              return formActions.loadFieldsConfig({ formName, formConfig });
            } else {
              return formActions.loadConfigSuccess({ formName, formConfig });
            }
          }),
        );
      }),
    ),
  );

  loadRemoteFormFieldsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.loadFieldsConfig),
      concatMap(({ formName, formConfig }) => {
        return this.formService.getFormFieldsConfig(formConfig).pipe(
          map((formFields) => {
            if (formConfig.remoteFormData) {
              this.store.dispatch(formActions.loadFieldsConfigSuccess({ formName, formConfig, formFields }));
              return formActions.getData({ formName, formConfig });
            } else {
              return formActions.loadFieldsConfigSuccess({ formName, formConfig, formFields });
            }
          }),
        );
      }),
    ),
  );

  getFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.getData),
      concatMap(({ formName, formConfig }) => {
        return this.formService.getFormData(formConfig).pipe(
          map(({ formConfig, formData }) => {
            return formActions.getDataSuccess({ formName, formConfig, formData });
          }),
        );
      }),
    ),
  );

  saveFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.saveData),
      concatMap(({ formName, formConfig, formData }) => {
        return this.formService.saveFormData(formConfig, formData).pipe(
          map(({ formConfig, formData }) => {
            return formActions.saveDataSuccess({ formName, formConfig, formData });
          }),
        );
      }),
    ),
  );

  saveFormDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.saveDataSuccess),
      concatMap(({ formConfig, formData }) =>
        of(formData).pipe(
          map(() => GnroMessageActions.show({ action: 'Update', keyName: 'formData', configType: formConfig.urlKey })),
        ),
      ),
    ),
  );

  /*
  uploadFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.uploadFiles),
      concatMap(({ formConfig, files }) => {
        return this.uploadFileService.sendFormUploadFiles(formConfig.urlKey, files).pipe(
          map(({ formConfig }) => {
            this.uploadFileService.uploadFiles = [];
            return formActions.uploadFilesSuccess({ formConfig });
          }),
        );
      }),
    ),
  );*/

  clearFormDataStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.clearStore),
      concatMap(({ formName }) => of(formActions.removeStore({ formName }))),
    ),
  );
}
