import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroDashboardConfig, GnroDashboardSetting, GnroTile, GnroTileOption } from '../models/dashboard.model';
import * as dashboardActions from './dashboard.actions';
import { selectDashboardConfig, selectDashboardSetting, selectDashboardTiles } from './dashboard.selectors';

@Injectable({ providedIn: 'root' })
export class GnroDashboardFacade {
  private readonly store = inject(Store);

  initDashboardConfig(dashboardId: string, dashboardConfig: GnroDashboardConfig): void {
    this.store.dispatch(dashboardActions.initDashboardConfig({ dashboardId, dashboardConfig }));
    if (dashboardConfig.remoteConfig) {
      this.store.dispatch(dashboardActions.loadRemoteDashboardConfig({ dashboardId, dashboardConfig }));
    }
  }

  setDashboardConfig(dashboardId: string, dashboardConfig: GnroDashboardConfig): void {
    this.store.dispatch(dashboardActions.loadDashboardConfigSuccess({ dashboardId, dashboardConfig }));
  }

  setDashboardOptions(dashboardId: string, options: GnroTileOption<unknown>[]): void {
    this.store.dispatch(dashboardActions.loadDashboardOptions({ dashboardId, options }));
  }

  setDashboardTiles(dashboardId: string, tiles: GnroTile<unknown>[]): void {
    this.store.dispatch(dashboardActions.loadDashboardTilesSuccess({ dashboardId, tiles }));
  }

  loadDashboardGridMapTiles(dashboardId: string, gridMap: number[][], tiles: GnroTile<unknown>[]): void {
    this.store.dispatch(dashboardActions.loadDashboardGridMapTiles({ dashboardId, gridMap, tiles }));
  }

  setGridViewport(dashboardId: string, width: number, height: number): void {
    this.store.dispatch(dashboardActions.setGridViewport({ dashboardId, width, height }));
  }

  clearDashboardStore(dashboardId: string): void {
    this.store.dispatch(dashboardActions.clearDashboardStore({ dashboardId }));
  }

  getSetting(dashboardId: string): Signal<GnroDashboardSetting> {
    return this.store.selectSignal(selectDashboardSetting(dashboardId));
  }

  getDashboardConfig(dashboardId: string): Signal<GnroDashboardConfig> {
    return this.store.selectSignal(selectDashboardConfig(dashboardId));
  }

  getDashboardTiles(dashboardId: string): Signal<GnroTile<unknown>[]> {
    return this.store.selectSignal(selectDashboardTiles(dashboardId));
  }
}
