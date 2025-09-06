import { createFeature, createReducer, on } from '@ngrx/store';
import { D3State, defaultD3State } from '../models/d3.model';
import { checkPieChartData } from '../utils/check-pie-chart-data';
import { initChartConfigs } from '../utils/init-chart-configs';
import { d3Actions } from './d3.actions';

export const initialState: D3State = {};

export const gnroD3Feature = createFeature({
  name: 'gnroD3',
  reducer: createReducer(
    initialState,
    on(d3Actions.initConfig, (state, action) => {
      const d3Config = { ...action.d3Config };
      const key = action.d3Id;
      const newState: D3State = { ...state };
      newState[key] = {
        ...defaultD3State,
        d3Config,
        d3Setting: {
          ...defaultD3State.d3Setting,
          d3Id: action.d3Id,
        },
      };
      return { ...newState };
    }),
    on(d3Actions.loadConfigSuccess, (state, action) => {
      const key = action.d3Id;
      const newState: D3State = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          d3Config: { ...state[key].d3Config, ...action.d3Config },
        };
      }
      return { ...newState };
    }),
    on(d3Actions.loadChartConfigsSuccess, (state, action) => {
      const key = action.d3Id;
      const newState: D3State = { ...state };
      if (state[key]) {
        const configs = state[key].chartConfigs ? state[key].chartConfigs : [];
        const chartConfigs = initChartConfigs([...configs, ...action.chartConfigs]);
        newState[key] = {
          ...state[key],
          chartConfigs,
        };
      }
      return { ...newState };
    }),
    on(d3Actions.getDataSuccess, (state, action) => {
      const key = action.d3Id;
      const newState: D3State = { ...state };
      if (state[key]) {
        const data = checkPieChartData(action.data, state[key].chartConfigs);
        newState[key] = {
          ...state[key],
          d3Config: { ...state[key].d3Config, ...action.d3Config },
          data: data,
        };
      }
      return { ...newState };
    }),
    on(d3Actions.removeStore, (state, action) => {
      const key = action.d3Id;
      const newState: D3State = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
