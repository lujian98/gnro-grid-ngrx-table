import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

export type GnroScaleColor = d3Scale.ScaleOrdinal<string, {}>;
export type GnroScaleLinear = d3Scale.ScaleLinear<number, number>;
export type GnroScaleTime = d3Scale.ScaleTime<number, number>;
export type GnroScaleBand = d3Scale.ScaleBand<string>;
export type GnroScale = GnroScaleLinear | GnroScaleTime | GnroScaleBand;

export type GnroScaleAxis = d3Axis.Axis<d3Axis.AxisDomain>;
