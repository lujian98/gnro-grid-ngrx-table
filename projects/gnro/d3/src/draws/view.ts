import { ElementRef, inject } from '@angular/core';
import * as d3 from 'd3-selection';
import {
  DEFAULT_BULLET_CHART_OPTIONS,
  DEFAULT_CHART_OPTIONS,
  DEFAULT_PIE_CHART_OPTIONS,
  DEFAULT_RADIAL_GAUGE_OPTIONS,
  DEFAULT_VERTICAL_BULLET_CHART_OPTIONS,
  GnroD3ChartConfig,
  GnroD3Options,
  GnroD3ZoomOptions,
  GnroMargin,
} from '../models';

export class GnroView {
  private readonly elementRef = inject(ElementRef);
  private height!: number;
  private _svg!: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  private chartConfigs!: GnroD3ChartConfig[];

  get svg(): d3.Selection<d3.BaseType, {}, HTMLElement, any> {
    return this._svg;
  }

  set svg(v: d3.Selection<d3.BaseType, {}, HTMLElement, any>) {
    this._svg = v;
  }

  constructor(private options: GnroD3Options) {}

  public clearElement(): void {
    d3.select(this.elementRef.nativeElement).select('g').remove();
    // @ts-ignore
    this.svg = null;
  }

  initView(chartConfigs: GnroD3ChartConfig[]): void {
    this.chartConfigs = chartConfigs;
    this.clearElement();
    this.initSvg();
  }

  update(): void {
    const elementRef = this.elementRef.nativeElement.firstChild;
    this.height = elementRef.clientHeight || 300;
    if (this.svg) {
      this.updateViewDimension();
    }
  }

  get width(): number {
    return this.options.drawWidth!;
  }

  get margin(): GnroMargin {
    return this.options.margin!;
  }

  getPanelHeight(panelId: string): number {
    const h = this.svg.select(`.panel${panelId}`).select('.drawArea').select('clipPath').select('rect').attr('height');
    return Number(h);
  }

  getBrushXHeight(panelId: string): number {
    return this.options.drawHeight2!;
  }

  getPanelWidth(panelId: string): number {
    return this.options.drawWidth!;
  }

  getBrushYWidth(panelId: string): number {
    return this.options.brushYWidth!;
  }

  private initSvg(): void {
    const drawID = Math.floor(Math.random() * 100000);
    // @ts-ignore
    this.svg = d3.select(this.elementRef.nativeElement).select('svg').attr('class', `mainSvg${drawID}`).append('g');

    const panels = [...new Set(this.chartConfigs.map((chart) => chart.panelId))];
    panels.forEach((panelId) => {
      const drawPanel = this.svg.append('g').attr('class', `panel${panelId}`);
      drawPanel.append('g').attr('class', 'interactiveDraw').attr('clip-path', `url(#clip${drawID})`);
      const drawArea = drawPanel.append('g').attr('class', 'drawArea');
      const pchart = this.chartConfigs[0];
      if (pchart.axisEnabled) {
        drawPanel.append('g').attr('class', 'xAxisDraw');
        drawPanel.append('g').attr('class', 'yAxisDraw');
      }
      let brushDraw: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
      if (pchart.zoom!.enabled && pchart.axisEnabled) {
        // TODO brush enable options
        // @ts-ignore
        brushDraw = drawPanel.append('g').attr('class', 'brushDraw');
      }
      if (pchart.zoom!.enabled) {
        drawArea.append('rect').attr('class', 'zoom');
      }
      drawArea.append('defs').append('clipPath').attr('id', `clip${drawID}`).append('rect');

      this.chartConfigs.forEach((chart) => {
        let type = chart.chartType;
        if (chart.yAxisId === 'RIGHT') {
          type += 'RIGHT';
        }
        drawArea.append('g').attr('class', type!).attr('clip-path', `url(#clip${drawID})`);
        if (chart.zoom!.enabled && chart.axisEnabled) {
          // TODO change chart.yAxisId !== 'RIGHT'
          brushDraw.append('g').attr('class', `${type}Brush`);
          brushDraw.append('g').attr('class', `${type}BrushY`);
        }
      });

      if (pchart.zoom!.enabled && pchart.axisEnabled) {
        brushDraw!.append('g').attr('class', 'context');
        brushDraw!.append('g').attr('class', 'contextBrushY');
      }
    });
  }

  updateViewDimension(): void {
    this.svg.attr('transform', `translate(${this.options.margin!.left},${this.options.margin!.top})`);
    const panels = [...new Set(this.chartConfigs.map((chart) => chart.panelId))];
    panels.forEach((panelId) => {
      const drawPanel = this.svg.select(`.panel${panelId}`);
      const drawArea = drawPanel.select('.drawArea');

      drawArea
        .select('clipPath')
        .select('rect')
        .attr('width', this.options.drawWidth!)
        .attr('height', this.options.drawHeight!)
        .attr('x', 0)
        .attr('y', 0);
      drawArea.select('.zoom').attr('width', this.options.drawWidth!).attr('height', this.options.drawHeight!);

      const top = this.height - this.options.drawHeight2! - this.options.margin!.bottom!;
      const yBrushPos = this.options.drawWidth! + 10; // 10 for the gap
      this.chartConfigs.forEach((chart) => {
        let type = chart.chartType;
        if (chart.yAxisId === 'RIGHT') {
          type += 'RIGHT';
        }
        drawPanel.select(`.${type}Brush`).attr('transform', `translate(0, ${top})`);
        drawPanel.select(`.${type}BrushY`).attr('transform', `translate(${yBrushPos}, 0)`);
      });

      drawPanel.select('.context').attr('transform', `translate(0, ${top})`);
      drawPanel.select('.contextBrushY').attr('transform', `translate(${yBrushPos}, 0)`);
    });
  }

  initOptions(value: GnroD3Options, chartConfig: GnroD3ChartConfig): void {
    // TODO default options
    if (!value) {
      value = DEFAULT_CHART_OPTIONS;
    }
    let options = DEFAULT_CHART_OPTIONS;
    if (chartConfig.chartType === 'bulletChart') {
      const bulletType = chartConfig.bullet && chartConfig.bullet.type ? chartConfig.bullet.type : 'horizontal';
      const dOptions = bulletType === 'vertical' ? DEFAULT_VERTICAL_BULLET_CHART_OPTIONS : DEFAULT_BULLET_CHART_OPTIONS;
      options = this.getOptions(dOptions, options);
    } else if (chartConfig.chartType === 'pieChart') {
      options = this.getOptions(DEFAULT_PIE_CHART_OPTIONS, options);
    } else if (chartConfig.chartType === 'radialGauge') {
      options = this.getOptions(DEFAULT_RADIAL_GAUGE_OPTIONS, options);
    }
    this.options = this.getOptions(value, options);
    // this.setZoomOptions();
  }

  setViewDimension(zoom: GnroD3ZoomOptions): void {
    const margin = this.options.margin;
    const elRef = this.elementRef.nativeElement.firstChild;
    const width = elRef.clientWidth || 300;
    const height = elRef.clientHeight || 300;
    const drawDimension = {
      drawWidth: width - margin!.left! - margin!.right! - (zoom.verticalBrushShow ? this.options.brushYWidth! + 30 : 0),
      drawHeight:
        height - margin!.top! - margin!.bottom! - (zoom.horizontalBrushShow ? this.options.drawHeight2! + 30 : 0),
    };
    this.options = { ...this.options, ...drawDimension };

    this.update();
  }

  private getOptions(option1: GnroD3Options, option2: GnroD3Options): GnroD3Options {
    for (const [key, value] of Object.entries(option1)) {
      // @ts-ignore
      if (typeof value === 'object' && value !== null && option2[key]) {
        // @ts-ignore
        option1[key] = { ...option2[key], ...option1[key] };
      }
    }
    return { ...option2, ...option1 };
  }
  /*
    private setZoomOptions(): void {
      // const zoom = this.options.zoom;
      zoom.horizontalOff = !zoom.enabled ? true : zoom.horizontalOff;
      zoom.horizontalBrushShow = !zoom.enabled || zoom.horizontalOff ? false : zoom.horizontalBrushShow;
      zoom.verticalOff = !zoom.enabled ? true : zoom.verticalOff;
      zoom.verticalBrushShow = !zoom.enabled || zoom.verticalOff ? false : zoom.verticalBrushShow;
    }
    */
}
