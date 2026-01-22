import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroD3Config } from '../models/d3.model';
import { GnroD3ChartConfig } from '../models/options.model';
import { d3Actions } from './d3.actions';
import { createD3SelectorsForFeature } from './d3.selectors';
import { GnroD3FeatureService } from './d3-state.module';

@Injectable({ providedIn: 'root' })
export class GnroD3Facade {
  private readonly store = inject(Store);
  private readonly d3FeatureService = inject(GnroD3FeatureService);

  initConfig(d3ChartName: string, d3Config: GnroD3Config): void {
    // Register feature dynamically before dispatching actions
    this.d3FeatureService.registerFeature(d3ChartName);
    this.store.dispatch(d3Actions.initConfig({ d3ChartName, d3Config }));

    if (d3Config.remoteD3Config) {
      this.store.dispatch(d3Actions.loadConfig({ d3ChartName, d3Config }));
    } else if (d3Config.remoteChartConfigs) {
      this.store.dispatch(d3Actions.loadChartConfigs({ d3ChartName, d3Config }));
    }
  }

  setChartConfigs(d3ChartName: string, d3Config: GnroD3Config, chartConfigs: GnroD3ChartConfig[]): void {
    this.store.dispatch(d3Actions.loadChartConfigsSuccess({ d3ChartName, d3Config, chartConfigs }));
    if (d3Config.remoteD3Data) {
      this.store.dispatch(d3Actions.getData({ d3ChartName, d3Config }));
    }
  }

  setData<T>(d3ChartName: string, d3Config: GnroD3Config, data: T[]): void {
    this.store.dispatch(d3Actions.getDataSuccess({ d3ChartName, d3Config, data }));
  }

  clearStore(d3ChartName: string): void {
    this.store.dispatch(d3Actions.clearStore({ d3ChartName }));
  }

  getConfig(d3ChartName: string): Signal<GnroD3Config> {
    const selectors = createD3SelectorsForFeature(d3ChartName);
    return this.store.selectSignal(selectors.selectD3Config);
  }

  getChartConfigs(d3ChartName: string): Signal<GnroD3ChartConfig[]> {
    const selectors = createD3SelectorsForFeature(d3ChartName);
    return this.store.selectSignal(selectors.selectD3ChartConfigs);
  }

  getData<T>(d3ChartName: string): Signal<T[]> {
    const selectors = createD3SelectorsForFeature(d3ChartName);
    return this.store.selectSignal(selectors.selectD3Data) as Signal<T[]>;
  }
}
