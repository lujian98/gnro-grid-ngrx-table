import { createActionGroup, props } from '@ngrx/store';
import { GnroDashboardConfig, GnroTile, GnroTileOption } from '../models/dashboard.model';

export const dashboardActions = createDashboardActions();

function createDashboardActions<T>() {
  return createActionGroup({
    source: '[Dashboard]',
    events: {
      'Init Config': props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Remote Config': props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Config Success': props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
      'Set Grid Viewport': props<{ dashboardId: string; width: number; height: number }>(),
      'Load Options': props<{ dashboardId: string; options: GnroTileOption<T>[] }>(),
      'Load Tiles': props<{ dashboardId: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Tiles Success': props<{ dashboardId: string; tiles: GnroTile<T>[] }>(),
      'Load Grid Map And Tiles': props<{ dashboardId: string; gridMap: number[][]; tiles: GnroTile<T>[] }>(),
      'Clear Store': props<{ dashboardId: string }>(),
      'Remove Store': props<{ dashboardId: string }>(),
    },
  });
}
