import { Action, createReducer, on } from '@ngrx/store';
import { defaultD3State, GnroD3State } from '../models/d3.model';
import { checkPieChartData } from '../utils/check-pie-chart-data';
import { initChartConfigs } from '../utils/init-chart-configs';
import { d3Actions } from './d3.actions';

// Feature key generator for per-d3ChartName feature slices
export function getD3FeatureKey(d3ChartName: string): string {
  return `d3_${d3ChartName}`;
}

// Initial state factory for per-d3ChartName state
export function getInitialD3State<T>(d3ChartName: string): GnroD3State<T> {
  return {
    ...defaultD3State(),
    d3Config: {
      ...defaultD3State().d3Config,
      d3ChartName,
    },
  };
}

// Cache for reducers by d3ChartName
const d3ReducersByFeature = new Map<
  string,
  (state: GnroD3State<unknown> | undefined, action: Action) => GnroD3State<unknown>
>();

// Factory function to create per-d3ChartName reducers
export function createD3ReducerForFeature(d3ChartName: string) {
  // Return cached reducer if available
  const cached = d3ReducersByFeature.get(d3ChartName);
  if (cached) {
    return cached;
  }

  const initialState = getInitialD3State<unknown>(d3ChartName);

  const d3Reducer = createReducer(
    initialState,
    on(d3Actions.initConfig, (state, action) => {
      if (action.d3ChartName !== d3ChartName) return state;
      const d3Config = { ...action.d3Config };
      // Always start from fresh initial state to avoid stale data
      const freshState = getInitialD3State<unknown>(d3ChartName);
      return {
        ...freshState,
        d3Config,
      };
    }),
    on(d3Actions.loadConfigSuccess, (state, action) => {
      if (action.d3ChartName !== d3ChartName) return state;
      return {
        ...state,
        d3Config: { ...state.d3Config, ...action.d3Config },
      };
    }),
    on(d3Actions.loadChartConfigsSuccess, (state, action) => {
      if (action.d3ChartName !== d3ChartName) return state;
      const configs = state.chartConfigs ? state.chartConfigs : [];
      const chartConfigs = initChartConfigs([...configs, ...action.chartConfigs]);
      return {
        ...state,
        chartConfigs,
      };
    }),
    on(d3Actions.getDataSuccess, (state, action) => {
      if (action.d3ChartName !== d3ChartName) return state;
      const data = checkPieChartData(action.data, state.chartConfigs);
      return {
        ...state,
        d3Config: { ...state.d3Config, ...action.d3Config },
        data: data as GnroD3State<unknown>['data'],
      };
    }),
    on(d3Actions.removeStore, (state, action) => {
      if (action.d3ChartName !== d3ChartName) return state;
      return getInitialD3State<unknown>(d3ChartName);
    }),
  );

  const reducerFn = (state: GnroD3State<unknown> | undefined, action: Action): GnroD3State<unknown> => {
    return d3Reducer(state, action);
  };

  d3ReducersByFeature.set(d3ChartName, reducerFn);
  return reducerFn;
}
