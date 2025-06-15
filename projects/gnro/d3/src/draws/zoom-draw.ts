import * as d3 from 'd3-selection';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import { GnroD3ViewComponent } from '../components/d3-view.component';
import { GnroScaleDraw, GnroView } from '.';
import { GnroScaleLinear, GnroD3ChartConfig } from '../models';

export class GnroZoomDraw<T> {
  zoom: any; // TODO define types
  brush: any;
  brushY: any;
  xRange!: any[];
  yRange!: any[];

  constructor(
    protected view: GnroView,
    private scale: GnroScaleDraw<T>,
    private draw: GnroD3ViewComponent<T>,
  ) {
    this.init();
  }

  get configs(): GnroD3ChartConfig {
    // TODO other charts if need only for X axis for now
    // console.log(' ssssssssssssssssss this.chartConfigs=', this.chartConfigs)
    return this.draw.chartConfigs$()[0];
  }

  get drawPanel(): d3.Selection<d3.BaseType, {}, HTMLElement, any> {
    const panelId = this.configs.panelId; // TODO other charts if need only for X axis for now
    return this.view.svg.select(`.panel${panelId}`);
  }

  get panelHeight(): number {
    return this.view.getPanelHeight(this.configs.panelId!);
  }

  get panelWidth(): number {
    return this.view.getPanelWidth(this.configs.panelId!);
  }

  get brushXHeight(): number {
    return this.view.getBrushXHeight(this.configs.panelId!);
  }

  get brushYWidth(): number {
    return this.view.getBrushYWidth(this.configs.panelId!);
  }

  init(): void {
    this.initZoom();
    if (this.configs.zoom!.horizontalBrushShow) {
      this.initHorizontalBrush();
    }
    if (this.configs.zoom!.verticalBrushShow) {
      this.initVerticalBrush();
    }
    this.update();
  }

  update(): void {
    this.updateZoom();
    if (this.configs.zoom!.horizontalBrushShow) {
      this.updateHorizontalBrush();
    }
    if (this.configs.zoom!.verticalBrushShow) {
      this.updateVerticalBrush();
    }
  }

  private initZoom(): void {
    this.zoom = d3Zoom.zoom().scaleExtent([1, Infinity]);
    this.drawPanel.select('.drawArea').call(this.zoom);
    this.zoom.on('zoom', this.zoomed.bind(this));
  }

  private updateZoom(): void {
    this.zoom
      .translateExtent([
        [0, 0],
        [this.panelWidth, this.panelHeight],
      ])
      .extent([
        [0, 0],
        [this.panelWidth, this.panelHeight],
      ]);
  }

  private initHorizontalBrush(): void {
    const context = this.drawPanel.select('.context');
    context.append('g').attr('class', 'axis axis--x').call(this.scale.scaleX.brushXAxis!);
    context.append('g').attr('class', 'brush');
  }

  private updateHorizontalBrush(): void {
    const context = this.drawPanel.select('.context');
    this.brush = d3Brush.brushX().extent([
      [0, 0],
      [this.panelWidth, this.brushXHeight],
    ]);
    context.select('.axis--x').attr('transform', 'translate(0,' + this.brushXHeight + ')');
    context.select('.brush').call(this.brush).call(this.brush.move, this.scale.scaleX.value!.range());
    this.brush.on('brush end', this.brushed.bind(this));
  }

  private initVerticalBrush(): void {
    const context = this.drawPanel.select('.contextBrushY');
    context.append('g').attr('class', 'axis axis--y').call(this.scale.scaleY.brushYAxis!);
    context.append('g').attr('class', 'brush');
  }

  private updateVerticalBrush(): void {
    const context = this.drawPanel.select('.contextBrushY');
    this.brushY = d3Brush.brushY().extent([
      [0, 0],
      [this.brushXHeight, this.panelHeight],
    ]);
    context.select('.axis--y').attr('transform', 'translate(50,0)');
    const range = this.scale.scaleY.brushY!.range();
    context
      .select('.brush')
      .call(this.brushY)
      .call(this.brushY.move, this.configs.yScaleType === 'band' ? range : range.reverse());
    this.brushY.on('brush end', this.brueshedY.bind(this));
  }

  setZoomRange(): void {
    if (this.xRange) {
      const xrange = this.scale.scaleX.value!.range();
      const x1 = Math.min(xrange[1], this.xRange[1]);
      const x0 = Math.max(xrange[0], this.xRange[0] - (this.xRange[1] - x1));
      const range = [x0, x1];
      this.setBrushedRange(range);
      if (this.configs.zoom!.horizontalBrushShow) {
        this.drawPanel.select('.context').select('.brush').call(this.brush.move, range);
      }
    }
    if (this.yRange) {
      const yrange = this.scale.scaleY.value!.range();
      if (yrange[1] < yrange[0]) {
        yrange.reverse();
      }
      const y1 = Math.min(yrange[1], this.yRange[1]);
      const y0 = Math.max(yrange[0], this.yRange[0] - (this.yRange[1] - y1));
      const range = [y0, y1];
      this.setBrushedYRange(range);
      if (this.configs.zoom!.verticalBrushShow) {
        this.drawPanel.select('.contextBrushY').select('.brush').call(this.brushY.move, range);
      }
    }
  }

  private zoomed(event: any): void {
    if (event.sourceEvent) {
      if (!this.configs.zoom!.horizontalOff) {
        if (this.configs.xScaleType === 'linear' || this.configs.xScaleType === 'time') {
          const t = event.transform;
          this.scale.scaleX.value!.domain(t.rescaleX(this.scale.scaleX.brushX).domain());
          this.redraw();
          this.xRange = this.scale.scaleX.value!.range().map(t.invertX, t);
          if (this.brush) {
            this.drawPanel.select('.context').select('.brush').call(this.brush.move, this.xRange);
          }
        } else if (this.configs.xScaleType === 'band') {
          const t = event.transform;
          const x0 = this.scale.scaleX.brushX!.range();
          const x = x0.map((d) => t.applyX(d));
          this.scale.scaleX.value!.range(x);
          this.redraw();
          this.xRange = [x0[0] + (x0[0] - x[0]) / t.k, x0[1] + (x0[1] - x[1]) / t.k];
          if (this.brush) {
            this.drawPanel.select('.context').select('.brush').call(this.brush.move, this.xRange);
          }
        }
      }
      if (!this.configs.zoom!.verticalOff) {
        if (this.configs.yScaleType === 'linear' || this.configs.yScaleType === 'time') {
          const t = event.transform;
          this.scale.scaleY.value!.domain(t.rescaleY(this.scale.scaleY.brushY).domain());
          this.redraw();
          this.yRange = this.scale.scaleY.brushY!.range().map(t.invertY, t).reverse();
          if (this.brushY) {
            this.drawPanel.select('.contextBrushY').select('.brush').call(this.brushY.move, this.yRange);
          }
        } else if (this.configs.yScaleType === 'band') {
          const t = event.transform;
          const y0 = this.scale.scaleY.brushY!.range();
          const y = y0.map((d) => t.applyY(d));
          this.scale.scaleY.value!.range(y);
          this.redraw();
          this.yRange = [y0[0] + (y0[0] - y[0]) / t.k, y0[1] + (y0[1] - y[1]) / t.k];
          if (this.brushY) {
            this.drawPanel.select('.contextBrushY').select('.brush').call(this.brushY.move, this.yRange);
          }
        }
      }
      this.draw.dispatch.call('drawZoom', this, event);
    }
  }

  private brueshedY(event: any): void {
    if (event.sourceEvent) {
      this.yRange = event.selection || this.scale.scaleY.brushY!.range();
      this.setBrushedYRange(this.yRange);
    }
  }

  private setBrushedYRange(range: any): void {
    if (this.configs.yScaleType === 'linear' || this.configs.yScaleType === 'time') {
      const yBrushYScale = this.scale.scaleY.brushY as GnroScaleLinear;
      const ydoman = range.map(yBrushYScale.invert, this.scale.scaleY.brushY).reverse();
      this.scale.scaleY.value!.domain(ydoman);
    } else if (this.configs.yScaleType === 'band') {
      const x0 = this.scale.scaleY.brushY!.range();
      const scale = this.panelHeight / (range[1] - range[0]);
      const x = [x0[0] + (x0[0] - range[0]) * scale, x0[1] + (x0[1] - range[1]) * scale];
      this.scale.scaleY.value!.range(x);
    }
    this.redraw();
    const sx0 = this.xRange ? -this.xRange[0] : 0;
    // TODO bug WARNING d3 only support one direction scale
    this.drawPanel
      .select('.drawArea')
      .call(
        this.zoom.transform,
        d3Zoom.zoomIdentity.scale(this.panelHeight / (range[1] - range[0])).translate(sx0, -range[0]),
      );
  }

  private brushed(event: any): void {
    if (event.sourceEvent) {
      this.xRange = event.selection || this.scale.scaleX.brushX!.range();
      this.setBrushedRange(this.xRange);
    }
  }

  private setBrushedRange(range: any): void {
    if (this.configs.xScaleType === 'linear' || this.configs.xScaleType === 'time') {
      this.brushXScaleLinear(range);
    } else if (this.configs.xScaleType === 'band') {
      this.brushXScaleBand(range);
    }
    this.redraw();
    const sy0 = this.yRange ? -this.yRange[0] : 0;
    // TODO bug WARNING d3 only support one direction scale
    this.drawPanel
      .select('.drawArea')
      .call(
        this.zoom.transform,
        d3Zoom.zoomIdentity.scale(this.panelWidth / (range[1] - range[0])).translate(-range[0], sy0),
      );
  }

  private brushXScaleLinear(range: any): void {
    const xBrushXScale = this.scale.scaleX.brushX as GnroScaleLinear;
    this.scale.scaleX.value!.domain(range.map(xBrushXScale.invert, this.scale.scaleX.brushX));
  }

  private brushXScaleBand(range: any): void {
    const x0 = this.scale.scaleX.brushX!.range();
    const scale = this.panelWidth / (range[1] - range[0]);
    const x = [x0[0] + (x0[0] - range[0]) * scale, x0[1] + (x0[1] - range[1]) * scale];
    this.scale.scaleX.value!.range(x);
  }

  private redraw(): void {
    this.draw.redraw();
    // @ts-ignore
    this.drawPanel.select('.axis--x').call(this.scale.scaleX.axis);
    // @ts-ignore
    this.drawPanel.select('.axis--xgrid').call(this.scale.scaleX.grid);
    // @ts-ignore
    this.drawPanel.select('.axis--y').call(this.scale.scaleY.axis);
    // @ts-ignore
    this.drawPanel.select('.axis--ygrid').call(this.scale.scaleY.grid);
  }
}
