import { Injectable, inject } from '@angular/core';
import { GnroUploadFileService } from '@gnro/ui/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GnroMessageActions } from '@gnro/ui/message';
import { Store } from '@ngrx/store';
import { concatMap, delay, map, mergeMap, of } from 'rxjs';
import { GnroFormService } from '../services/form.service';
import { formActions } from './form.actions';

@Injectable()
export class GnroFormEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private formService = inject(GnroFormService);
  private uploadFileService = inject(GnroUploadFileService);

  loadRemoteFormConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.loadConfig),
      concatMap(({ formId, formConfig }) => {
        return this.formService.getRemoteFormConfig(formConfig).pipe(
          map((formConfig) => {
            if (formConfig.remoteFieldsConfig) {
              this.store.dispatch(formActions.loadConfigSuccess({ formId, formConfig }));
              return formActions.loadFieldsConfig({ formId, formConfig });
            } else {
              return formActions.loadConfigSuccess({ formId, formConfig });
            }
          }),
        );
      }),
    ),
  );

  loadRemoteFormFieldsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.loadFieldsConfig),
      concatMap(({ formId, formConfig }) => {
        return this.formService.getFormFieldsConfig(formConfig).pipe(
          map((formFields) => {
            if (formConfig.remoteFormData) {
              this.store.dispatch(formActions.loadFieldsConfigSuccess({ formId, formConfig, formFields }));
              return formActions.getData({ formId, formConfig });
            } else {
              return formActions.loadFieldsConfigSuccess({ formId, formConfig, formFields });
            }
          }),
        );
      }),
    ),
  );

  getFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.getData),
      concatMap(({ formId, formConfig }) => {
        return this.formService.getFormData(formConfig).pipe(
          map(({ formConfig, formData }) => {
            return formActions.getDataSuccess({ formId, formConfig, formData });
          }),
        );
      }),
    ),
  );

  saveFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formActions.saveData),
      concatMap(({ formId, formConfig, formData }) => {
        return this.formService.saveFormData(formConfig, formData).pipe(
          map(({ formConfig, formData }) => {
            return formActions.saveDataSuccess({ formId, formConfig, formData });
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
      delay(250), // wait 250 after destory the component to clear data store
      mergeMap(({ formId }) => of(formId).pipe(map((formId) => formActions.removeStore({ formId })))),
    ),
  );
}
