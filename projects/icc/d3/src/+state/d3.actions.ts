import { createAction, props } from '@ngrx/store';
import { IccD3Config } from '../models/d3.model';
import { IccD3ChartConfig } from '../models/options.model';

export const initD3Config = createAction('[D3] Init D3 Panel Config', props<{ d3Config: IccD3Config }>());
export const loadRemoteD3Config = createAction('[D3] Load Remote D3 Config', props<{ d3Config: IccD3Config }>());
export const loadRemoteD3ConfigSuccess = createAction(
  '[D3] Load Remote D3 Config Success',
  props<{ d3Config: IccD3Config }>(),
);

export const loadD3ChartConfigs = createAction('[D3] Load Remote D3 Chart Configs', props<{ d3Config: IccD3Config }>());
export const loadD3ChartConfigsSuccess = createAction(
  '[D3] Load Remote D3 Chart Configs Success',
  props<{ d3Config: IccD3Config; chartConfigs: IccD3ChartConfig[] }>(),
);

export const getD3Data = createAction('[D3] Get D3 Data', props<{ d3Config: IccD3Config }>());
export const getD3DataSuccess = createAction(
  '[D3] Get D3 Data Success',
  props<{ d3Config: IccD3Config; data: any[] }>(),
);

export const clearD3DataStore = createAction('[D3] Clear D3 Panel Data Store', props<{ d3Id: string }>());
export const removeD3DataStore = createAction('[D3] Remove D3 Panel Data Store', props<{ d3Id: string }>());
