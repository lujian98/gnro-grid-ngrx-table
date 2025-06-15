import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroOptionType, GnroSelectFieldConfig, GnroSelectFieldSetting } from '../models/select-field.model';
import * as selectFieldActions from './select-field.actions';
import { selectFieldConfig, selectFieldSetting, selectOptions } from './select-field.selectors';

@Injectable()
export class GnroSelectFieldFacade {
  private readonly store = inject(Store);

  initFieldConfig(fieldId: string, fieldConfig: GnroSelectFieldConfig): void {
    this.store.dispatch(selectFieldActions.initFieldConfig({ fieldId, fieldConfig }));
    if (fieldConfig.remoteConfig) {
      this.store.dispatch(selectFieldActions.loadRemoteFieldConfig({ fieldId, fieldConfig }));
    }

    if (fieldConfig.remoteOptions && !fieldConfig.remoteConfig) {
      this.store.dispatch(selectFieldActions.loadSelectFieldOptions({ fieldId, fieldConfig }));
    }
  }

  setSelectFieldOptions(fieldId: string, options: GnroOptionType[]): void {
    this.store.dispatch(selectFieldActions.loadSelectFieldOptionsSuccess({ fieldId, options }));
  }

  clearSelectFieldStore(fieldId: string): void {
    this.store.dispatch(selectFieldActions.clearSelectFieldStore({ fieldId }));
  }

  getFieldConfig(fieldId: string): Signal<GnroSelectFieldConfig> {
    return this.store.selectSignal(selectFieldConfig(fieldId));
  }

  getOptions(fieldId: string): Signal<GnroOptionType[]> {
    return this.store.selectSignal(selectOptions(fieldId));
  }

  getSetting(fieldId: string): Signal<GnroSelectFieldSetting | undefined> {
    return this.store.selectSignal(selectFieldSetting(fieldId));
  }
}
