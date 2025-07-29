import { signal } from '@angular/core';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { GnroView } from '.';
import {
  DEFAULT_CHART_CONFIGS,
  GnroD3ChartConfig,
  GnroScale,
  GnroScaleAxis,
  GnroScaleBand,
  GnroScaleColor,
  GnroScaleLinear,
} from '../models';
import { GnroScaleFactory } from '../scales/scale-factory';

export interface AxisScale {
  factory?: GnroScaleFactory<any>;
  panelId?: string;
  axisId?: string;
  value?: GnroScale;
  axis?: GnroScaleAxis;
  grid?: GnroScaleAxis;
  group?: GnroScaleBand;

  // context X brush
  brushX?: GnroScale;
  brushXAxis?: GnroScaleAxis;
  brushXGroup?: GnroScaleBand;

  // context Y brush
  brushY?: GnroScale;
  brushYAxis?: GnroScaleAxis;
  brushYGroup?: GnroScaleBand;
}

export class GnroScaleDraw<T> {
  x: AxisScale[] = [];
  y: AxisScale[] = [];
  colors!: GnroScaleColor;
  colors$ = signal<GnroScaleColor | undefined>(undefined);

  //scaleChange$ = new Subject<GnroScaleDraw<T>>();
  private chartConfigs!: GnroD3ChartConfig[];

  get scaleX(): AxisScale {
    // TODO zoom for all other charts
    return this.x[0];
  }

  get scaleY(): AxisScale {
    // TODO zoom for all other charts
    return this.y[0];
  }

  get configs(): GnroD3ChartConfig {
    // TODO used only for color map now
    // console.log(' this.chartConfigs=', this.chartConfigs)
    return this.chartConfigs ? this.chartConfigs[0] : DEFAULT_CHART_CONFIGS;
  }

  get panels(): string[] {
    // @ts-ignore
    return [...new Set(this.chartConfigs.map((chart) => chart.panelId))];
  }
  constructor(protected view: GnroView) {}

  buildScales(chartConfigs: GnroD3ChartConfig[]): void {
    this.chartConfigs = chartConfigs;
    this.setXScale();
    this.setYScale();
    this.update();
    this.setXAxis();
    this.setYAxis();
    //this.scaleChange$.next(this); // TODO may need track change for all?
  }

  update(): void {
    this.updateXScale();
    this.updateYScale();
  }

  updateXScale(): void {
    this.panels.forEach((panelId) => {
      const charts = this.chartConfigs.filter((chart) => chart.panelId === panelId);
      const panelWidth = this.view.getPanelWidth(panelId);
      const brushYWidth = this.view.getBrushYWidth(panelId);
      charts.forEach((chart) => {
        const xScale = this.x.find((scale) => scale.panelId === panelId && scale.axisId === chart.xAxisId);
        xScale!.factory!.updateRange(xScale!.value!, [0, panelWidth]);
        xScale!.factory!.updateRange(xScale!.brushX!, [0, panelWidth]);
        xScale!.factory!.updateRange(xScale!.brushY!, [0, brushYWidth]);
      });
    });
  }

  updateYScale(): void {
    // TODO separate draw area in Y axis???
    this.panels.forEach((panelId) => {
      const charts = this.chartConfigs.filter((chart) => chart.panelId === panelId);
      const panelHeight = this.view.getPanelHeight(panelId);
      const brushXHeight = this.view.getBrushXHeight(panelId);
      charts.forEach((chart) => {
        const yScale = this.y.find((scale) => scale.panelId === panelId && scale.axisId === chart.yAxisId);
        const reverse = chart.yScaleType === 'band';
        yScale!.factory!.updateRange(yScale!.value!, [panelHeight, 0], reverse);
        yScale!.factory!.updateRange(yScale!.brushX!, [brushXHeight, 0], reverse);
        yScale!.factory!.updateRange(yScale!.brushY!, [panelHeight, 0], reverse);
      });
    });
  }

  setDrawDomain(data: T[]): void {
    const drawData = data.filter((d: any) => !d.disabled);
    // if (drawData.length > 0 && this.configs.axisEnabled) { // TODO this.configs.axisEnabled
    this.setXDomain(drawData);
    this.setYDomain(drawData);
    // }
  }

  private setXScale(): void {
    this.panels.forEach((xPanelId) => {
      const charts = this.chartConfigs.filter((chart) => chart.panelId === xPanelId);
      const panelWidth = this.view.getPanelWidth(xPanelId);
      const brushYWidth = this.view.getBrushYWidth(xPanelId);
      charts.forEach((chart) => {
        const xScale = this.x.filter((scale) => scale.panelId === xPanelId && scale.axisId === chart.xAxisId);
        if (xScale.length === 0) {
          const xFactory = new GnroScaleFactory(chart.xScaleType!, chart);
          this.x.push({
            factory: xFactory,
            panelId: xPanelId,
            axisId: chart.xAxisId,
            value: xFactory.getScale([0, panelWidth]),
            brushX: xFactory.getScale([0, panelWidth]),
            brushY: xFactory.getScale([0, brushYWidth]),
            group: chart.chartType === 'groupedBarChart' ? d3Scale.scaleBand().padding(0.05) : undefined,
            brushXGroup: chart.chartType === 'groupedBarChart' ? d3Scale.scaleBand().padding(0.05) : undefined,
            brushYGroup: chart.chartType === 'groupedBarChart' ? d3Scale.scaleBand().padding(0.05) : undefined,
          });
        }
      });
    });
  }

  private setYScale(): void {
    this.panels.forEach((panelid) => {
      const charts = this.chartConfigs.filter((chart) => chart.panelId === panelid);
      const panelHeight = this.view.getPanelHeight(panelid);
      const brushXHeight = this.view.getBrushXHeight(panelid);
      charts.forEach((chart) => {
        const reverse = chart.yScaleType === 'band';
        const yScale = this.y.filter((scale) => scale.panelId === panelid && scale.axisId === chart.yAxisId);
        if (yScale.length === 0) {
          const yFactory = new GnroScaleFactory(chart.yScaleType!, chart);
          this.y.push({
            factory: yFactory,
            panelId: panelid,
            axisId: chart.yAxisId,
            value: yFactory.getScale([panelHeight, 0], reverse),
            brushX: yFactory.getScale([brushXHeight, 0], reverse),
            brushY: yFactory.getScale([panelHeight, 0], reverse),
            group: chart.chartType === 'groupedHorizontalBarChart' ? d3Scale.scaleBand().padding(0.05) : undefined,
            brushXGroup:
              chart.chartType === 'groupedHorizontalBarChart' ? d3Scale.scaleBand().padding(0.05) : undefined,
            brushYGroup:
              chart.chartType === 'groupedHorizontalBarChart' ? d3Scale.scaleBand().padding(0.05) : undefined,
          });
        }
      });
    });
  }

  setXDomain(data: any[], type = null): void {
    // stacked / normalized / null
    this.panels.forEach((panelId, pindex) => {
      const charts = this.chartConfigs.filter((chart) => chart.panelId === panelId);
      const pdata = data.filter((d) => (d.panelId && d.panelId === panelId) || (!d.panelId && pindex === 0));
      charts.forEach((chart, index) => {
        const xScale = this.x.find((scale) => scale.panelId === panelId && scale.axisId === chart.xAxisId);
        const xdata = pdata.filter((d) => (d.xAxisId && d.xAxisId === chart.xAxisId) || (!d.xAxisId && index === 0));
        if (xdata.length > 0) {
          xScale!.factory!.setXDomain(xScale!.value!, xdata, type!);
          xScale!.brushX!.domain(xScale!.value!.domain() as any);
          xScale!.brushY!.domain(xScale!.value!.domain() as any);
          if (chart.chartType === 'groupedBarChart') {
            const keys = xdata.map((d) => chart.x0!(d));
            const scaleX = xScale!.value as GnroScaleBand;
            xScale!.group!.domain(keys).rangeRound([0, scaleX.bandwidth()]);
            const xBrushXScale = xScale!.brushX as GnroScaleBand;
            const gmax = Math.max(10, xBrushXScale.bandwidth());
            xScale!.brushXGroup!.domain(keys).rangeRound([0, gmax]);
            const xBrushYScale = xScale!.brushY as GnroScaleBand;
            const gmaxBrushX = Math.max(10, xBrushYScale.bandwidth()); // TODO min 10??
            xScale!.brushYGroup!.domain(keys).rangeRound([0, gmaxBrushX]);
          }
        }
      });
    });
  }

  setYDomain(data: any[], type = null): void {
    // TODO data check scale y1
    this.panels.forEach((panelId, pindex) => {
      const charts = this.chartConfigs.filter((chart) => chart.panelId === panelId);
      const pdata = data.filter((d) => (d.panelId && d.panelId === panelId) || (!d.panelId && pindex === 0));
      charts.forEach((chart, index) => {
        const yScale = this.y.find((scale) => scale.panelId === panelId && scale.axisId === chart.yAxisId);
        const ydata = pdata.filter((d) => (d.yAxisId && d.yAxisId === chart.yAxisId) || (!d.yAxisId && index === 0));
        if (ydata.length > 0) {
          yScale!.factory!.setYDomain(yScale!.value!, ydata, type!);
        }
        yScale!.brushX!.domain(yScale!.value!.domain() as any);
        yScale!.brushY!.domain(yScale!.value!.domain() as any);
        if (chart.chartType === 'groupedHorizontalBarChart') {
          const keys = ydata.map((d) => chart.x0!(d));
          const scaleY = yScale!.value as GnroScaleBand;
          const brushXScale = yScale!.brushX as GnroScaleBand;
          const brushYScale = yScale!.brushY as GnroScaleBand;
          yScale!.group!.domain(keys).rangeRound([0, scaleY.bandwidth()]);
          yScale!.brushXGroup!.domain(keys).rangeRound([0, brushXScale.bandwidth()]);
          yScale!.brushYGroup!.domain(keys).rangeRound([0, brushYScale.bandwidth()]);
        }
      });
    });
  }

  setXAxis(): void {
    this.panels.forEach((panelId, pindex) => {
      const charts = this.chartConfigs.filter((chart) => chart.panelId === panelId);
      charts.forEach((chart, index) => {
        const xScale = this.x.find((scale) => scale.panelId === panelId && scale.axisId === chart.xAxisId);
        if (chart.xAxis!.position === 'bottom') {
          // @ts-ignore
          xScale.axis = d3Axis.axisBottom(xScale!.value as GnroScaleLinear);
          // @ts-ignore
          xScale.grid = d3Axis.axisBottom(xScale!.value as GnroScaleLinear).tickFormat(() => '');
        } else if (chart.xAxis!.position === 'top') {
          // @ts-ignore
          xScale.axis = d3Axis.axisTop(xScale!.value as GnroScaleLinear);
          // @ts-ignore
          xScale.grid = d3Axis.axisTop(xScale!.value as GnroScaleLinear).tickFormat(() => '');
        }
        // @ts-ignore
        xScale.brushXAxis = d3Axis.axisBottom(xScale!.brushX as GnroScaleLinear);
      });
    });
  }

  setYAxis(): void {
    this.panels.forEach((panelId, pindex) => {
      const charts = this.chartConfigs.filter((chart) => chart.panelId === panelId);
      charts.forEach((chart, index) => {
        const yScale = this.y.find((scale) => scale.panelId === panelId && scale.axisId === chart.yAxisId);
        if (chart.yAxis!.position === 'left') {
          // @ts-ignore
          yScale.axis = d3Axis.axisLeft(yScale!.value as GnroScaleLinear);
          // @ts-ignore
          yScale.grid = d3Axis.axisLeft(yScale!.value as GnroScaleLinear).tickFormat(() => '');
        } else if (chart.yAxis!.position === 'right') {
          // @ts-ignore
          yScale.axis = d3Axis.axisRight(yScale!.value as GnroScaleLinear);
          // @ts-ignore
          yScale.grid = d3Axis.axisRight(yScale!.value as GnroScaleLinear).tickFormat(() => '');
        }
        // @ts-ignore
        yScale.brushYAxis = d3Axis.axisRight(yScale!.brushY as GnroScaleLinear);
      });
    });
  }

  // TODO move this to scale factory
  getXBarWidth(scale: any, scaleX: AxisScale, chart: GnroD3ChartConfig, data: T[], isFirst: boolean = false): any {
    if (scale.bandwidth) {
      return Math.max(1, scale.bandwidth());
    } else if (data.length > 0) {
      const length = chart.y0!(data[0]).length; // TODO pass in or better get data length
      if (length > 0) {
        const range = scale.range();
        const barWidth = Math.floor((range[1] - (length - 1) * 0.1) / length - 1.0);
        let scaleBar = 1;
        if (!isFirst) {
          const xdomain = scale.domain();
          // @ts-ignore
          scaleBar = (range[1] - range[0]) / (scaleX.brushX(xdomain[1]) - scaleX.brushX(xdomain[0]));
        }
        return Math.max(1, Math.floor(scaleBar * barWidth));
      }
    }
  }

  getYBarHeight(scale: any, scaleY: AxisScale, chart: GnroD3ChartConfig, data: T[], isFirst: boolean = false): any {
    if (scale.bandwidth) {
      return Math.max(1, scale.bandwidth());
    } else if (data.length > 0) {
      const length = chart.y0!(data[0]).length; // TODO pass in or better get data length
      const range = scale.range();
      const barWidth = Math.floor((range[1] - (length - 1) * 0.1) / length - 1.0);
      let scaleBar = 1;
      if (!isFirst) {
        const xdomain = scale.domain(); // TODO this.scaleY.value.yBrushX
        // @ts-ignore
        scaleBar = (range[1] - range[0]) / (scaleY.brushX(xdomain[1]) - scaleY.brushX(xdomain[0]));
      }
      return Math.max(1, Math.floor(scaleBar * barWidth));
    }
  }

  initColor(data: T[]): void {
    // TODO
    this.setColors(this.configs.colors || d3ScaleChromatic.schemeCategory10);
    this.setColorDomain(data);
  }

  public setColors(colors: any): void {
    this.colors = d3Scale.scaleOrdinal(colors);
    this.colors$.set(this.colors);
  }

  public setColorDomain(data: any[]): void {
    let keys = data.map((d, i) => this.configs.drawColor!(d, i));
    if (this.configs.chartType === 'barChart' || this.configs.chartType === 'pieChart') {
      const values = this.configs.y0!(data[0]);
      keys = values.map((d: any, i: number) => this.configs.drawColor!(d, i));
    }
    this.colors.domain(keys);
  }
}
