import { createActionGroup, props } from '@ngrx/store';
import { GnroDashboardConfig, GnroTile, GnroTileOption } from '../models/dashboard.model';

export const dashboardActions = createDashboardActions();

function createDashboardActions<T>() {
  return createActionGroup({
    source: 'Dashboard',
    events: {
      'Init Config': props<{ dashboardName: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Remote Config': props<{ dashboardName: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Config Success': props<{ dashboardName: string; dashboardConfig: GnroDashboardConfig }>(),
      'Set Grid Viewport': props<{ dashboardName: string; width: number; height: number }>(),
      'Load Options': props<{ dashboardName: string; options: GnroTileOption<T>[] }>(),
      'Load Tiles': props<{ dashboardName: string; dashboardConfig: GnroDashboardConfig }>(),
      'Load Tiles Success': props<{ dashboardName: string; tiles: GnroTile<T>[] }>(),
      'Load Grid Map And Tiles': props<{ dashboardName: string; gridMap: number[][]; tiles: GnroTile<T>[] }>(),
      'Clear Store': props<{ dashboardName: string }>(),
      'Remove Store': props<{ dashboardName: string }>(),
    },
  });
}
