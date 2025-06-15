import { createSelector } from '@ngrx/store';
import { D3State, defaultD3State } from '../models/d3.model';

export interface AppD3State {
  gnroD3: D3State;
}

export const featureSelector = (state: AppD3State) => state.gnroD3;

export const selectD3Setting = (d3Id: string) =>
  createSelector(featureSelector, (state: D3State) => {
    return state && state[d3Id] ? state[d3Id].d3Setting : defaultD3State.d3Setting;
  });

export const selectD3Config = (d3Id: string) =>
  createSelector(featureSelector, (state: D3State) => {
    return state && state[d3Id] ? state[d3Id].d3Config : defaultD3State.d3Config;
  });

export const selectD3ChartConfigs = (d3Id: string) =>
  createSelector(featureSelector, (state: D3State) => {
    return state && state[d3Id] && state[d3Id].chartConfigs.length > 0 ? state[d3Id].chartConfigs : [];
  });

export const selectD3Data = (d3Id: string) =>
  createSelector(featureSelector, (state: D3State) => {
    return state && state[d3Id] ? state[d3Id].data : undefined;
  });
