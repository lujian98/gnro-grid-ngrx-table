import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroDashboardConfig, GnroDashboardSetting, GnroTile, GnroTileOption } from '../models/dashboard.model';
import { dashboardActions } from './dashboard.actions';
import { createDashboardSelectorsForFeature } from './dashboard.selectors';
import { GnroDashboardFeatureService } from './dashboard-state.module';

@Injectable({ providedIn: 'root' })
export class GnroDashboardFacade {
  private readonly store = inject(Store);
  private readonly dashboardFeatureService = inject(GnroDashboardFeatureService);

  initConfig(dashboardName: string, dashboardConfig: GnroDashboardConfig): void {
    // Register feature dynamically before dispatching actions
    this.dashboardFeatureService.registerFeature(dashboardName);
    this.store.dispatch(dashboardActions.initConfig({ dashboardName, dashboardConfig }));
    if (dashboardConfig.remoteConfig) {
      this.store.dispatch(dashboardActions.loadRemoteConfig({ dashboardName, dashboardConfig }));
    }
  }

  setConfig(dashboardName: string, dashboardConfig: GnroDashboardConfig): void {
    this.store.dispatch(dashboardActions.loadConfigSuccess({ dashboardName, dashboardConfig }));
  }

  setOptions<T>(dashboardName: string, options: GnroTileOption<T>[]): void {
    this.store.dispatch(dashboardActions.loadOptions({ dashboardName, options }));
  }

  setTiles<T>(dashboardName: string, tiles: GnroTile<T>[]): void {
    this.store.dispatch(dashboardActions.loadTilesSuccess({ dashboardName, tiles }));
  }

  loadGridMapTiles<T>(dashboardName: string, gridMap: number[][], tiles: GnroTile<T>[]): void {
    this.store.dispatch(dashboardActions.loadGridMapAndTiles({ dashboardName, gridMap, tiles }));
  }

  setGridViewport(dashboardName: string, width: number, height: number): void {
    this.store.dispatch(dashboardActions.setGridViewport({ dashboardName, width, height }));
  }

  clearStore(dashboardName: string): void {
    this.store.dispatch(dashboardActions.clearStore({ dashboardName }));
  }

  getSetting(dashboardName: string): Signal<GnroDashboardSetting> {
    const selectors = createDashboardSelectorsForFeature(dashboardName);
    return this.store.selectSignal(selectors.selectDashboardSetting);
  }

  getDashboardConfig(dashboardName: string): Signal<GnroDashboardConfig> {
    const selectors = createDashboardSelectorsForFeature(dashboardName);
    return this.store.selectSignal(selectors.selectDashboardConfig);
  }

  getTiles<T>(dashboardName: string): Signal<GnroTile<T>[]> {
    const selectors = createDashboardSelectorsForFeature(dashboardName);
    return this.store.selectSignal(selectors.selectDashboardTiles) as Signal<GnroTile<T>[]>;
  }
}
