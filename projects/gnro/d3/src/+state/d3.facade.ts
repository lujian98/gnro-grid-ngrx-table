import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroD3Config, GnroD3Setting } from '../models/d3.model';
import { GnroD3ChartConfig } from '../models/options.model';
import * as d3Actions from './d3.actions';
import { selectD3Config, selectD3ChartConfigs, selectD3Data, selectD3Setting } from './d3.selectors';

@Injectable({ providedIn: 'root' })
export class GnroD3Facade {
  private readonly store = inject(Store);

  initD3Config(d3Id: string, d3Config: GnroD3Config): void {
    this.store.dispatch(d3Actions.initD3Config({ d3Id, d3Config }));

    if (d3Config.remoteD3Config) {
      this.store.dispatch(d3Actions.loadRemoteD3Config({ d3Id, d3Config }));
    } else if (d3Config.remoteChartConfigs) {
      this.store.dispatch(d3Actions.loadD3ChartConfigs({ d3Id, d3Config }));
    }
  }

  setD3ChartConfigs(d3Id: string, d3Config: GnroD3Config, chartConfigs: GnroD3ChartConfig[]): void {
    this.store.dispatch(d3Actions.loadD3ChartConfigsSuccess({ d3Id, d3Config, chartConfigs }));
    if (d3Config.remoteD3Data) {
      this.store.dispatch(d3Actions.getD3Data({ d3Id, d3Config }));
    }
  }

  setD3Data(d3Id: string, d3Config: GnroD3Config, data: any): void {
    this.store.dispatch(d3Actions.getD3DataSuccess({ d3Id, d3Config, data }));
  }

  clearD3DataStore(d3Id: string): void {
    this.store.dispatch(d3Actions.clearD3DataStore({ d3Id }));
  }

  getD3Config(d3Id: string): Signal<GnroD3Config> {
    return this.store.selectSignal(selectD3Config(d3Id));
  }

  getSetting(d3Id: string): Signal<GnroD3Setting> {
    return this.store.selectSignal(selectD3Setting(d3Id));
  }

  getD3ChartConfigs(d3Id: string): Signal<GnroD3ChartConfig[]> {
    return this.store.selectSignal(selectD3ChartConfigs(d3Id));
  }

  getD3Data(d3Id: string): Signal<any> {
    return this.store.selectSignal(selectD3Data(d3Id));
  }
}
