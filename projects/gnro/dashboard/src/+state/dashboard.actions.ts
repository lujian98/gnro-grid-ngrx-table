import { createActionGroup, props } from '@ngrx/store';
import { GnroDashboardConfig, GnroTile, GnroTileOption } from '../models/dashboard.model';

export const dashboardActions = createListViewActions();

export function createListViewActions<T>() {
  return createActionGroup({
    source: '[Dashboard]',
    events: {
      'Init Dashboard Config': props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Remote Dashboard Config': props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Dashboard Config Success': props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
      'Set Grid Viewport': props<{ dashboardId: string; width: number; height: number }>(),
      'Load Dashboard Options': props<{ dashboardId: string; options: GnroTileOption<T>[] }>(),
      'Load Dashboard Tiles': props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Dashboard Tiles Success': props<{ dashboardId: string; tiles: GnroTile<T>[] }>(),
      'Load Dashboard Grid Map And Tiles': props<{ dashboardId: string; gridMap: number[][]; tiles: GnroTile<T>[] }>(),
      'Clear Dashboard Store': props<{ dashboardId: string }>(),
      'Remove Dashboard Store': props<{ dashboardId: string }>(),
    },
  });
}

/*
export const loadDashboardTiles = createAction(
  '[Dashboard] Load Dashboard Tiles',
  props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
);

export const loadDashboardTilesSuccess = createAction(
  '[Dashboard] Load Dashboard Tiles Success',
  props<{ dashboardId: string; tiles: GnroTile<unknown>[] }>(),
);

export const loadDashboardGridMapTiles = createAction(
  '[Dashboard] Load Dashboard Grid Map and Tiles',
  props<{ dashboardId: string; gridMap: number[][]; tiles: GnroTile<unknown>[] }>(),
);

export const clearDashboardStore = createAction('[Dashboard]] Clear Dashboard Store', props<{ dashboardId: string }>());
export const removeDashboardStore = createAction(
  '[Dashboard]] Remove Dashboard Store',
  props<{ dashboardId: string }>(),
);

*/
/*
export const initDashboardConfig = createAction(
  '[Dashboard] Init Dashboard Config',
  props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
);

export const loadRemoteDashboardConfig = createAction(
  '[Dashboard] Load Remote Dashboard Config',
  props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
);

export const loadDashboardConfigSuccess = createAction(
  '[Dashboard] Load Dashboard Config Success',
  props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
);

export const setGridViewport = createAction(
  '[Dashboard] Set Grid Viewport',
  props<{ dashboardId: string; width: number; height: number }>(),
);*/

/*
export const loadDashboardOptions = createAction(
  '[Dashboard] Load Tab Options',
  props<{ dashboardId: string; options: GnroTileOption<unknown>[] }>(),
);*/
