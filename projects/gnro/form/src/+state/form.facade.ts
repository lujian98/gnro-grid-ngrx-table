import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroButtonConfg } from '@gnro/ui/core';
import { GnroFormConfig, GnroFormSetting } from '../models/form.model';
import { GnroFormField } from '@gnro/ui/fields';
import * as formActions from './form.actions';
import { selectFormConfig, selectFormFieldsConfig, selectFormData, selectFormSetting } from './form.selectors';

@Injectable({ providedIn: 'root' })
export class GnroFormFacade {
  private readonly store = inject(Store);

  initFormConfig(formId: string, formConfig: GnroFormConfig): void {
    this.store.dispatch(formActions.initFormConfig({ formId, formConfig }));

    if (formConfig.remoteFormConfig) {
      this.store.dispatch(formActions.loadRemoteFormConfig({ formId, formConfig }));
    } else if (formConfig.remoteFieldsConfig) {
      this.store.dispatch(formActions.loadFormFieldsConfig({ formId, formConfig }));
    }
  }

  setFormFieldsConfig(formId: string, formConfig: GnroFormConfig, formFields: GnroFormField[]): void {
    this.store.dispatch(formActions.loadFormFieldsConfigSuccess({ formId, formConfig, formFields }));
    if (formConfig.remoteFormData) {
      this.store.dispatch(formActions.getFormData({ formId, formConfig }));
    }
  }

  setFormData(formId: string, formConfig: GnroFormConfig, formData: object): void {
    this.store.dispatch(formActions.getFormDataSuccess({ formId, formConfig, formData }));
  }

  setFormEditable(formId: string, button: GnroButtonConfg): void {
    this.store.dispatch(formActions.setFormEditable({ formId, button }));
  }

  getFormData(formId: string, formConfig: GnroFormConfig): void {
    if (formConfig.remoteFormData) {
      this.store.dispatch(formActions.getFormData({ formId, formConfig }));
    }
  }

  saveFormData(formId: string, formConfig: GnroFormConfig, formData: object): void {
    this.store.dispatch(formActions.saveFormData({ formId, formConfig, formData }));
  }

  /*
  uploadFiles(formConfig: GnroFormConfig, files: GnroUploadFile[]): void {
    if (files.length > 0) {
      this.store.dispatch(formActions.uploadFiles({ formConfig, files }));
    }
  }*/

  clearformDataStore(formId: string): void {
    this.store.dispatch(formActions.clearFormDataStore({ formId }));
  }

  getFormConfig(formId: string): Signal<GnroFormConfig> {
    return this.store.selectSignal(selectFormConfig(formId));
  }

  getSetting(fieldId: string): Signal<GnroFormSetting> {
    return this.store.selectSignal(selectFormSetting(fieldId));
  }

  getFormFieldsConfig(formId: string): Signal<GnroFormField[]> {
    return this.store.selectSignal(selectFormFieldsConfig(formId));
  }

  getFormSignalData(formId: string): Signal<object | undefined> {
    return this.store.selectSignal(selectFormData(formId));
  }
}
