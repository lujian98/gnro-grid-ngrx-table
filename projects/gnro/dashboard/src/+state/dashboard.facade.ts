import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroDashboardConfig, GnroDashboardSetting, GnroTile, GnroTileOption } from '../models/dashboard.model';
import { dashboardActions } from './dashboard.actions';
import { selectDashboardConfig, selectDashboardSetting, selectDashboardTiles } from './dashboard.selectors';

@Injectable({ providedIn: 'root' })
export class GnroDashboardFacade {
  private readonly store = inject(Store);

  initConfig(dashboardId: string, dashboardConfig: GnroDashboardConfig): void {
    this.store.dispatch(dashboardActions.initConfig({ dashboardId, dashboardConfig }));
    if (dashboardConfig.remoteConfig) {
      this.store.dispatch(dashboardActions.loadRemoteConfig({ dashboardId, dashboardConfig }));
    }
  }

  setConfig(dashboardId: string, dashboardConfig: GnroDashboardConfig): void {
    this.store.dispatch(dashboardActions.loadConfigSuccess({ dashboardId, dashboardConfig }));
  }

  setOptions<T>(dashboardId: string, options: GnroTileOption<T>[]): void {
    this.store.dispatch(dashboardActions.loadOptions({ dashboardId, options }));
  }

  setTiles<T>(dashboardId: string, tiles: GnroTile<T>[]): void {
    this.store.dispatch(dashboardActions.loadTilesSuccess({ dashboardId, tiles }));
  }

  loadGridMapTiles<T>(dashboardId: string, gridMap: number[][], tiles: GnroTile<T>[]): void {
    this.store.dispatch(dashboardActions.loadGridMapAndTiles({ dashboardId, gridMap, tiles }));
  }

  setGridViewport(dashboardId: string, width: number, height: number): void {
    this.store.dispatch(dashboardActions.setGridViewport({ dashboardId, width, height }));
  }

  clearStore(dashboardId: string): void {
    this.store.dispatch(dashboardActions.clearStore({ dashboardId }));
  }

  getSetting(dashboardId: string): Signal<GnroDashboardSetting> {
    return this.store.selectSignal(selectDashboardSetting(dashboardId));
  }

  getDashboardConfig(dashboardId: string): Signal<GnroDashboardConfig> {
    return this.store.selectSignal(selectDashboardConfig(dashboardId));
  }

  getTiles<T>(dashboardId: string): Signal<GnroTile<T>[]> {
    return this.store.selectSignal(selectDashboardTiles(dashboardId)) as Signal<GnroTile<T>[]>;
  }
}
