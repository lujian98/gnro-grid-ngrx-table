import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroOptionType, GnroSelectFieldConfig, GnroSelectFieldSetting } from '../models/select-field.model';
import { selectFieldActions } from './select-field.actions';
import { selectFieldConfig, selectFieldSetting, selectOptions } from './select-field.selectors';

@Injectable({ providedIn: 'root' })
export class GnroSelectFieldFacade {
  private readonly store = inject(Store);

  initConfig(fieldId: string, fieldConfig: GnroSelectFieldConfig): void {
    this.store.dispatch(selectFieldActions.initConfig({ fieldId, fieldConfig }));
    if (fieldConfig.remoteConfig) {
      this.store.dispatch(selectFieldActions.loadRemoteConfig({ fieldId, fieldConfig }));
    }

    if (fieldConfig.remoteOptions && !fieldConfig.remoteConfig) {
      this.store.dispatch(selectFieldActions.loadOptions({ fieldId, fieldConfig }));
    }
  }

  setOptions(fieldId: string, options: GnroOptionType[]): void {
    this.store.dispatch(selectFieldActions.loadOptionsSuccess({ fieldId, options }));
  }

  reloadOptions(fieldId: string): void {
    const fieldConfig = this.getFieldConfig(fieldId)();
    this.store.dispatch(selectFieldActions.loadOptions({ fieldId, fieldConfig }));
  }

  clearStore(fieldId: string): void {
    this.store.dispatch(selectFieldActions.clearStore({ fieldId }));
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
