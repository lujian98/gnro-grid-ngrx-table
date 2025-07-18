import { GnroD3ChartConfig, GnroD3Options } from './options.model';

export interface GnroD3PieChartOptions {
  startAngle?: number;
  endAngle?: number;
  padAngle?: number;
  donut?: number; // 0 - 0.95 R innerRadius(radius * Math.min(0.95, donut)
  labelTextSize?: number;
  centerOffsetX?: number;
  centerOffsetY?: number;
}

export const DEFAULT_PIE_CHART_OPTIONS: GnroD3Options = {
  margin: { top: 10, right: 10, bottom: 10, left: 10 },
};

export const DEFAULT_PIE_CHART_CONFIGS: GnroD3ChartConfig = {
  axisEnabled: false,
  pie: {
    startAngle: 0,
    endAngle: Math.PI * 2,
    padAngle: 0.005,
    donut: 0.0,
    labelTextSize: 8 / 150,
    centerOffsetX: 0,
    centerOffsetY: 0,
  },
  zoom: {
    enabled: false,
  },
};
