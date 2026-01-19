import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroButtonConfg, GnroDataType } from '@gnro/ui/core';
import { GnroFormConfig, GnroFormSetting } from '../models/form.model';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroFormFeatureService } from './form-state.module';
import { formActions } from './form.actions';
import { createFormSelectorsForFeature } from './form.selectors';

@Injectable({ providedIn: 'root' })
export class GnroFormFacade {
  private readonly store = inject(Store);
  private readonly formFeatureService = inject(GnroFormFeatureService);

  initConfig(formName: string, formConfig: GnroFormConfig): void {
    this.formFeatureService.registerFeature(formName);
    this.store.dispatch(formActions.initConfig({ formName, formConfig }));

    if (formConfig.remoteFormConfig) {
      this.store.dispatch(formActions.loadConfig({ formName, formConfig }));
    } else if (formConfig.remoteFieldsConfig) {
      this.store.dispatch(formActions.loadFieldsConfig({ formName, formConfig }));
    }
  }

  setFieldsConfig(formName: string, formConfig: GnroFormConfig, formFields: GnroFormField[]): void {
    this.store.dispatch(formActions.loadFieldsConfigSuccess({ formName, formConfig, formFields }));
    if (formConfig.remoteFormData) {
      this.store.dispatch(formActions.getData({ formName, formConfig }));
    }
  }

  setData(formName: string, formConfig: GnroFormConfig, formData: GnroDataType): void {
    this.store.dispatch(formActions.getDataSuccess({ formName, formConfig, formData }));
  }

  setEditable(formName: string, button: GnroButtonConfg): void {
    this.store.dispatch(formActions.setEditable({ formName, button }));
  }

  getData(formName: string, formConfig: GnroFormConfig): void {
    if (formConfig.remoteFormData) {
      this.store.dispatch(formActions.getData({ formName, formConfig }));
    }
  }

  saveData(formName: string, formConfig: GnroFormConfig, formData: GnroDataType): void {
    this.store.dispatch(formActions.saveData({ formName, formConfig, formData }));
  }

  /*
  uploadFiles(formConfig: GnroFormConfig, files: GnroUploadFile[]): void {
    if (files.length > 0) {
      this.store.dispatch(formActions.uploadFiles({ formConfig, files }));
    }
  }*/

  clearStore(formName: string): void {
    this.store.dispatch(formActions.clearStore({ formName }));
  }

  getConfig(formName: string): Signal<GnroFormConfig> {
    const selectors = createFormSelectorsForFeature(formName);
    return this.store.selectSignal(selectors.selectFormConfig);
  }

  getSetting(formName: string): Signal<GnroFormSetting> {
    const selectors = createFormSelectorsForFeature(formName);
    return this.store.selectSignal(selectors.selectFormSetting);
  }

  getFieldsConfig(formName: string): Signal<GnroFormField[]> {
    const selectors = createFormSelectorsForFeature(formName);
    return this.store.selectSignal(selectors.selectFormFieldsConfig);
  }

  getSignalData(formName: string): Signal<GnroDataType | undefined> {
    const selectors = createFormSelectorsForFeature(formName);
    return this.store.selectSignal(selectors.selectFormData);
  }
}
