import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroButtonConfg } from '@gnro/ui/core';
import { GnroFormConfig, GnroFormSetting } from '../models/form.model';
import { GnroFormField } from '@gnro/ui/fields';
import { formActions } from './form.actions';
import { selectFormConfig, selectFormFieldsConfig, selectFormData, selectFormSetting } from './form.selectors';

@Injectable({ providedIn: 'root' })
export class GnroFormFacade {
  private readonly store = inject(Store);

  initConfig(formId: string, formConfig: GnroFormConfig): void {
    this.store.dispatch(formActions.initConfig({ formId, formConfig }));

    if (formConfig.remoteFormConfig) {
      this.store.dispatch(formActions.loadConfig({ formId, formConfig }));
    } else if (formConfig.remoteFieldsConfig) {
      this.store.dispatch(formActions.loadFieldsConfig({ formId, formConfig }));
    }
  }

  setFieldsConfig(formId: string, formConfig: GnroFormConfig, formFields: GnroFormField[]): void {
    this.store.dispatch(formActions.loadFieldsConfigSuccess({ formId, formConfig, formFields }));
    if (formConfig.remoteFormData) {
      this.store.dispatch(formActions.getData({ formId, formConfig }));
    }
  }

  setData(formId: string, formConfig: GnroFormConfig, formData: object): void {
    this.store.dispatch(formActions.getDataSuccess({ formId, formConfig, formData }));
  }

  setEditable(formId: string, button: GnroButtonConfg): void {
    this.store.dispatch(formActions.setEditable({ formId, button }));
  }

  getData(formId: string, formConfig: GnroFormConfig): void {
    if (formConfig.remoteFormData) {
      this.store.dispatch(formActions.getData({ formId, formConfig }));
    }
  }

  saveData(formId: string, formConfig: GnroFormConfig, formData: object): void {
    this.store.dispatch(formActions.saveData({ formId, formConfig, formData }));
  }

  /*
  uploadFiles(formConfig: GnroFormConfig, files: GnroUploadFile[]): void {
    if (files.length > 0) {
      this.store.dispatch(formActions.uploadFiles({ formConfig, files }));
    }
  }*/

  clearStore(formId: string): void {
    this.store.dispatch(formActions.clearStore({ formId }));
  }

  getConfig(formId: string): Signal<GnroFormConfig> {
    return this.store.selectSignal(selectFormConfig(formId));
  }

  getSetting(fieldId: string): Signal<GnroFormSetting> {
    return this.store.selectSignal(selectFormSetting(fieldId));
  }

  getFieldsConfig(formId: string): Signal<GnroFormField[]> {
    return this.store.selectSignal(selectFormFieldsConfig(formId));
  }

  getSignalData(formId: string): Signal<object | undefined> {
    return this.store.selectSignal(selectFormData(formId));
  }
}
