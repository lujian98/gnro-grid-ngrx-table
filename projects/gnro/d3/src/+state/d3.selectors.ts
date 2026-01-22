import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { defaultD3State, GnroD3Config, GnroD3State } from '../models/d3.model';
import { GnroD3ChartConfig } from '../models/options.model';
import { getD3FeatureKey } from './d3.reducer';

// Selector types for the factory
export interface D3Selectors {
  selectD3Config: MemoizedSelector<object, GnroD3Config>;
  selectD3ChartConfigs: MemoizedSelector<object, GnroD3ChartConfig[]>;
  selectD3Data: MemoizedSelector<object, unknown[] | undefined>;
}

// Cache for selectors by d3ChartName
const d3SelectorsByFeature = new Map<string, D3Selectors>();

// Factory function to create per-d3ChartName selectors with memoization
export function createD3SelectorsForFeature(d3ChartName: string): D3Selectors {
  // Return cached selectors if available
  const cached = d3SelectorsByFeature.get(d3ChartName);
  if (cached) {
    return cached;
  }

  const featureKey = getD3FeatureKey(d3ChartName);
  const selectD3FeatureState = createFeatureSelector<GnroD3State<unknown>>(featureKey);

  const selectD3Config = createSelector(selectD3FeatureState, (state) =>
    state ? state.d3Config : defaultD3State().d3Config,
  );

  const selectD3ChartConfigs = createSelector(selectD3FeatureState, (state) =>
    state && state.chartConfigs.length > 0 ? state.chartConfigs : [],
  );

  const selectD3Data = createSelector(selectD3FeatureState, (state) => (state ? state.data : []));

  const selectors: D3Selectors = {
    selectD3Config,
    selectD3ChartConfigs,
    selectD3Data,
  };

  d3SelectorsByFeature.set(d3ChartName, selectors);
  return selectors;
}
