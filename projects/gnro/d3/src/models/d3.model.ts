import { GnroD3ChartConfig, GnroD3Options } from './options.model';

export interface GnroD3Config {
  d3ChartName: string;
  urlKey: string; // Only for remote config // options!: GnroD3Options
  chartName: string; // require if remote or use default
  options?: GnroD3Options;
  remoteD3Config: boolean;
  remoteChartConfigs: boolean;
  remoteD3Data: boolean;
}

export interface GnroD3ConfigResponse {
  d3Config: Partial<GnroD3Config>;
}

export interface GnroD3ChartConfigsResponse {
  d3ChartConfigs: GnroD3ChartConfig[];
}

export interface GnroD3DataResponse<T> {
  d3Data: T[];
}

export interface GnroD3State<T> {
  d3Config: GnroD3Config;
  chartConfigs: GnroD3ChartConfig[];
  data: T[] | undefined;
}

export const defaultD3Config: GnroD3Config = {
  d3ChartName: 'd3ChartName',
  urlKey: 'd3config', // Only for remote config
  chartName: 'chartName',
  options: undefined,
  remoteD3Config: false,
  remoteChartConfigs: false,
  remoteD3Data: false,
};

export function defaultD3State<T>(): GnroD3State<T> {
  return {
    d3Config: defaultD3Config,
    chartConfigs: [],
    data: undefined,
  };
}
