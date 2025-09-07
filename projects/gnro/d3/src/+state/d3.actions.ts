import { createActionGroup, props } from '@ngrx/store';
import { GnroD3Config } from '../models/d3.model';
import { GnroD3ChartConfig } from '../models/options.model';

export const d3Actions = createD3Actions();

function createD3Actions<T>() {
  return createActionGroup({
    source: '[D3]',
    events: {
      'Init Config': props<{ d3Id: string; d3Config: GnroD3Config }>(),
      'Load Config': props<{ d3Id: string; d3Config: GnroD3Config }>(),
      'Load Config Success': props<{ d3Id: string; d3Config: GnroD3Config }>(),
      'Load Chart Configs': props<{ d3Id: string; d3Config: GnroD3Config }>(),
      'Load Chart Configs Success': props<{
        d3Id: string;
        d3Config: GnroD3Config;
        chartConfigs: GnroD3ChartConfig[];
      }>(),
      'Get Data': props<{ d3Id: string; d3Config: GnroD3Config }>(),
      'Get Data Success': props<{ d3Id: string; d3Config: GnroD3Config; data: T[] }>(),
      'Clear Store': props<{ d3Id: string }>(),
      'Remove Store': props<{ d3Id: string }>(),
    },
  });
}
