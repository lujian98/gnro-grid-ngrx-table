import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroOptionType, GnroSelectFieldConfig, GnroSelectFieldSetting } from '../models/select-field.model';
import { selectFieldActions } from './select-field.actions';
import { createSelectFieldSelectorsForFeature } from './select-field.selectors';
import { GnroSelectFieldFeatureService } from './select-field-state.module';

@Injectable({ providedIn: 'root' })
export class GnroSelectFieldFacade {
  private readonly store = inject(Store);
  private readonly selectFieldFeatureService = inject(GnroSelectFieldFeatureService);

  initConfig(fieldName: string, fieldConfig: GnroSelectFieldConfig): void {
    // Register feature dynamically before dispatching actions
    this.selectFieldFeatureService.registerFeature(fieldName);
    this.store.dispatch(selectFieldActions.initConfig({ fieldName, fieldConfig }));

    if (fieldConfig.remoteConfig) {
      this.store.dispatch(selectFieldActions.loadRemoteConfig({ fieldName, fieldConfig }));
    }

    if (fieldConfig.remoteOptions && !fieldConfig.remoteConfig) {
      this.store.dispatch(selectFieldActions.loadOptions({ fieldName, fieldConfig }));
    }
  }

  setOptions(fieldName: string, options: GnroOptionType[]): void {
    this.store.dispatch(selectFieldActions.loadOptionsSuccess({ fieldName, options }));
  }

  reloadOptions(fieldName: string): void {
    const fieldConfig = this.getFieldConfig(fieldName)();
    this.store.dispatch(selectFieldActions.loadOptions({ fieldName, fieldConfig }));
  }

  clearStore(fieldName: string): void {
    this.store.dispatch(selectFieldActions.clearStore({ fieldName }));
  }

  getFieldConfig(fieldName: string): Signal<GnroSelectFieldConfig> {
    const selectors = createSelectFieldSelectorsForFeature(fieldName);
    return this.store.selectSignal(selectors.selectFieldConfig);
  }

  getOptions(fieldName: string): Signal<GnroOptionType[]> {
    const selectors = createSelectFieldSelectorsForFeature(fieldName);
    return this.store.selectSignal(selectors.selectOptions);
  }

  getSetting(fieldName: string): Signal<GnroSelectFieldSetting | undefined> {
    const selectors = createSelectFieldSelectorsForFeature(fieldName);
    return this.store.selectSignal(selectors.selectFieldSetting);
  }
}
