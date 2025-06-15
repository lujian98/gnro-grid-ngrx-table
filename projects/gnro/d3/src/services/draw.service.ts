import { Injectable } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { GnroScaleDraw, GnroAbstractDraw, GnroView } from '../draws';
import { GnroD3ChartConfig } from '../models';
import {
  GnroLineChart,
  GnroAreaChart,
  GnrobulletChart,
  GnroStackedAreaChart,
  GnroBarChart,
  GnroGroupedBarChart,
  GnroStackedBarChart,
  GnroHorizontalBarChart,
  GnroGroupedHorizontalBarChart,
  GnroStackedHorizontalBarChart,
  GnroPieChart,
  GnroCandleStickBarChart,
} from '../charts';

import { GnroRadialGauge } from '../gauge';

@Injectable()
export class GnroDrawServie<T> {
  componentMapper = {
    lineChart: GnroLineChart,
    // lineChartY2: GnroLineChart,
    areaChart: GnroAreaChart,
    bulletChart: GnrobulletChart,
    stackedAreaChart: GnroStackedAreaChart,
    stackedNormalizedAreaChart: GnroStackedAreaChart,
    stackedStreamAreaChart: GnroStackedAreaChart,

    barChart: GnroBarChart,
    groupedBarChart: GnroGroupedBarChart,
    stackedBarChart: GnroStackedBarChart,
    stackedNormalizedBarChart: GnroStackedBarChart,

    horizontalBarChart: GnroHorizontalBarChart,
    groupedHorizontalBarChart: GnroGroupedHorizontalBarChart,
    stackedHorizontalBarChart: GnroStackedHorizontalBarChart,
    stackedNormalizedHorizontalBarChart: GnroStackedHorizontalBarChart,

    pieChart: GnroPieChart,
    candleStickBarChart: GnroCandleStickBarChart,

    radialGauge: GnroRadialGauge,
  };

  constructor() {}

  getDraw(
    view: GnroView,
    scale: GnroScaleDraw<T>,
    dispatch: d3Dispatch.Dispatch<{}>,
    chart: GnroD3ChartConfig,
  ): GnroAbstractDraw<T> {
    // @ts-ignore
    let component = this.componentMapper[chart.chartType];
    if (!component) {
      component = this.componentMapper.lineChart;
    }
    const componentRef = new component(view, scale, dispatch, chart);
    return componentRef;
  }
}
