import { GnroD3Options, GnroD3ChartConfig } from './options.model';
import { GnroD3Range } from './range.model';

export interface GnroD3BulletChartData {
  range?: GnroD3Range[]; // should this move to options
  measures?: any[];
  markerLines?: any[]; // should this move to options
}

export interface GnroD3BulletChartOptions {
  type?: 'horizontal' | 'vertical';
  // valueMarkerColor?: string; // TODO not sure to use only one color for all value markers or value colors?
  markerLineWidth?: number;
}

export const DEFAULT_BULLET_CHART_OPTIONS: GnroD3Options = {
  margin: { top: 0, right: 20, bottom: 20, left: 60 },
};

export const DEFAULT_BULLET_CHART_CONFIGS: GnroD3ChartConfig = {
  xScaleType: 'linear',
  yScaleType: 'linear',
  y0: (d: any) => d.measures,
  x: (d: any) => d.value,
  y: (d: any) => d.label,
  bullet: {
    type: 'horizontal',
    markerLineWidth: 2,
  },
  legend: {
    enabled: false,
  },
  zoom: {
    enabled: true,
    horizontalOff: false,
    horizontalBrushShow: false,
    verticalOff: true,
    verticalBrushShow: false,
  },
};

export const DEFAULT_VERTICAL_BULLET_CHART_OPTIONS: GnroD3Options = {
  margin: { top: 20, right: 0, bottom: 40, left: 40 },
};

export const DEFAULT_VERTICAL_BULLET_CHART_CONFIGS: GnroD3ChartConfig = {
  xScaleType: 'linear',
  yScaleType: 'linear',
  y0: (d: any) => d.measures,
  x: (d: any) => d.label,
  y: (d: any) => d.value,
  bullet: {
    type: 'vertical',
    markerLineWidth: 2,
  },
  legend: {
    enabled: false,
  },
  zoom: {
    enabled: true,
    horizontalOff: true,
    horizontalBrushShow: false,
    verticalOff: false,
    verticalBrushShow: false,
  },
};
