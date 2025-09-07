import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroD3Config, GnroD3Setting } from '../models/d3.model';
import { GnroD3ChartConfig } from '../models/options.model';
import { d3Actions } from './d3.actions';
import { selectD3Config, selectD3ChartConfigs, selectD3Data, selectD3Setting } from './d3.selectors';

@Injectable({ providedIn: 'root' })
export class GnroD3Facade {
  private readonly store = inject(Store);

  initConfig(d3Id: string, d3Config: GnroD3Config): void {
    this.store.dispatch(d3Actions.initConfig({ d3Id, d3Config }));

    if (d3Config.remoteD3Config) {
      this.store.dispatch(d3Actions.loadConfig({ d3Id, d3Config }));
    } else if (d3Config.remoteChartConfigs) {
      this.store.dispatch(d3Actions.loadChartConfigs({ d3Id, d3Config }));
    }
  }

  setChartConfigs(d3Id: string, d3Config: GnroD3Config, chartConfigs: GnroD3ChartConfig[]): void {
    this.store.dispatch(d3Actions.loadChartConfigsSuccess({ d3Id, d3Config, chartConfigs }));
    if (d3Config.remoteD3Data) {
      this.store.dispatch(d3Actions.getData({ d3Id, d3Config }));
    }
  }

  setData<T>(d3Id: string, d3Config: GnroD3Config, data: T[]): void {
    this.store.dispatch(d3Actions.getDataSuccess({ d3Id, d3Config, data }));
  }

  clearStore(d3Id: string): void {
    this.store.dispatch(d3Actions.clearStore({ d3Id }));
  }

  getConfig(d3Id: string): Signal<GnroD3Config> {
    return this.store.selectSignal(selectD3Config(d3Id));
  }

  getSetting(d3Id: string): Signal<GnroD3Setting> {
    return this.store.selectSignal(selectD3Setting(d3Id));
  }

  getChartConfigs(d3Id: string): Signal<GnroD3ChartConfig[]> {
    return this.store.selectSignal(selectD3ChartConfigs(d3Id));
  }

  getData<T>(d3Id: string): Signal<T[]> {
    return this.store.selectSignal(selectD3Data(d3Id)) as Signal<T[]>;
  }
}
