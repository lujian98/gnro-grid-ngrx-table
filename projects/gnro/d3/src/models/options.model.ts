import * as d3Format from 'd3-format';
import { GnroD3BulletChartOptions } from './bullet.model';
import { GnroD3RadialGaugeOptions } from './gauge.model';
import { GnroD3LegendOptions, DEFAULT_D3LEGEND_OPTIONS } from './legend.model';
import { GnroD3PieChartOptions } from './pie.model';
import { GnroD3PopoverOptions, DEFAULT_D3POPOVER_OPTIONS } from './popover.model';
import { GnroD3ZoomOptions, DEFAULT_D3ZOOM_OPTIONS } from './zoom.model';
import { GnroD3AxisOptions, DEFAULT_D3XAXIS_OPTIONS, DEFAULT_D3YAXIS_OPTIONS } from './axis.model';

export interface GnroPosition {
  x: number;
  y: number;
}

export interface GnroMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface GnroD3Options {
  margin?: GnroMargin;
  width?: string | number;

  brushYWidth?: number;
  drawHeight?: number;
  drawWidth?: number;
  drawHeight2?: number; // bottom brush height
}

export const DEFAULT_CHART_OPTIONS: GnroD3Options = {
  margin: { top: 10, right: 10, bottom: 40, left: 50 },
  width: '100%',
  brushYWidth: 50,
  drawHeight2: 50,
};

export interface GnroD3ChartConfig {
  chartType?: string;
  panelId?: string;

  xAxisId?: string;
  yAxisId?: string;

  useInteractiveGuideline?: boolean;
  xScaleType?: string;
  yScaleType?: string;

  x0?: Function;
  y0?: Function;
  x?: Function;
  y?: Function;

  colors?: string[];
  drawColor?: Function;
  barColor?: Function;
  duration?: number;

  axisEnabled?: boolean;
  xAxis?: GnroD3AxisOptions;
  yAxis?: GnroD3AxisOptions;
  legend?: GnroD3LegendOptions;
  bullet?: GnroD3BulletChartOptions;
  pie?: GnroD3PieChartOptions;
  radialGauge?: GnroD3RadialGaugeOptions;
  popover?: GnroD3PopoverOptions;
  zoom?: GnroD3ZoomOptions;

  // margin?: GnroMargin;  // TODO ?????
  // width?: string | number;

  // brushYWidth?: number;
  // legendHeight?: number; // TODO
  // drawHeight?: number;
  // drawWidth?: number;
  // drawHeight2?: number; // bottom brush height
}

export const DEFAULT_CHART_CONFIGS: GnroD3ChartConfig = {
  chartType: 'lineChart',
  useInteractiveGuideline: false,
  xScaleType: 'time',
  yScaleType: 'linear',
  x0: (d: any) => d.key,
  y0: (d: any) => d?.values,
  x: (d: any) => d.x,
  y: (d: any) => d.y,
  drawColor: (d: any) => d.key,
  duration: 0,
  axisEnabled: true,
  xAxis: DEFAULT_D3XAXIS_OPTIONS,
  yAxis: DEFAULT_D3YAXIS_OPTIONS,
  legend: DEFAULT_D3LEGEND_OPTIONS,
  popover: DEFAULT_D3POPOVER_OPTIONS,
  zoom: DEFAULT_D3ZOOM_OPTIONS,
};
