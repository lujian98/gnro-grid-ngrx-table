import * as d3 from 'd3-selection';
import * as d3Array from 'd3-array';
import { GnroScaleDraw, GnroView } from '.';
import { GnroD3ViewComponent } from '../components/d3-view.component';
import {
  GnroScaleLinear,
  GnroScaleBand,
  GnroD3Options,
  GnroD3Popover,
  GnroD3PopoverSerie,
  GnroD3Interactive,
  GnroD3ChartConfig,
} from '../models';

export class GnroInteractiveDraw<T> {
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

  constructor(
    protected view: GnroView,
    private scale: GnroScaleDraw<T>,
    private draw: GnroD3ViewComponent<T>,
  ) {
    this.drawPanel
      .select('.drawArea')
      .on('mousemove', (e, d) => this.updateInteractive(e, true))
      .on('mouseout', (e, d) => this.updateInteractive(e, false));
    this.init();
    this.update();
    this.draw.dispatch.on('drawZoom', (e) => this.updateInteractive(e.sourceEvent, true));
  }

  // updateOptions(): void {
  //  this.update();
  // }

  update(): void {
    const data = this.getInteractiveData(0);
    if (this.configs.useInteractiveGuideline) {
      this.drawPanel.select('.interactiveDraw').select('.guideLine').attr('y2', this.panelHeight);
    }
    this.drawPanel
      .select('.interactiveDraw')
      .selectAll('g')
      .data(() => data.filter((d: any) => !d.disabled))
      .join('g')
      .selectAll('circle')
      .data((d) => d.value)
      .join('circle')
      .attr('class', 'guideline, circle')
      .style('stroke-width', 2)
      .attr('r', 5)
      .style('opacity', 0);
  }

  private init(): void {
    if (this.configs.useInteractiveGuideline) {
      this.drawPanel
        .select('.interactiveDraw')
        .append('line')
        .attr('class', 'guideLine')
        // .style('stroke', 'red')
        .style('stroke-width', 2)
        .style('opacity', 0)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0);
    }
  }

  private updateInteractive(e: any, mouseover: boolean): void {
    const pxy = d3.pointer(e, e.target);
    let idx = -1;
    if (this.configs.xScaleType === 'band') {
      const xScale = this.scale.scaleX.value as GnroScaleBand;
      idx = this.scaleBandInvert(xScale, pxy[0]);
    } else if (this.configs.yScaleType === 'band') {
      const yScale = this.scale.scaleY.value as GnroScaleBand;
      idx = this.scaleBandInvert(yScale, pxy[1]);
    } else if (this.configs.chartType !== 'radialGauge') {
      // TODO yScale linear ???
      const xScale = this.scale.scaleX.value as GnroScaleLinear;
      const bisect = d3Array.bisector((d) => this.configs.x!(d)).right;
      const x0 = xScale.invert(pxy[0]);
      this.draw.data$().forEach((d) => {
        const values = this.configs.y0!(d);
        idx = bisect(values, x0);
      });
    }
    const data: GnroD3Interactive[] = this.getInteractiveData(idx);
    if (this.configs.useInteractiveGuideline) {
      this.drawPanel
        .select('.interactiveDraw')
        .select('.guideLine')
        .style('opacity', mouseover ? 1 : 0)
        .attr('x1', pxy[0])
        .attr('x2', pxy[0]);
    }
    this.updateGuideLineCircle(data, pxy[0], mouseover);
    if (data.length > 0 && mouseover) {
      const pd = this.getPopoverData(data);
      this.draw.dispatch.call('drawMouseover', this, { event: e, data: pd });
    }
  }

  scaleBandInvert(scale: GnroScaleBand, x: number): number {
    const domain = scale.domain();
    const paddingOuter = scale(domain[0]);
    const eachBand = scale.step();
    const index = Math.floor((x - paddingOuter!) / eachBand);
    return index < domain.length ? index : -1;
  }

  private updateGuideLineCircle(data: any[], x: number, mouseover: boolean): void {
    if (this.configs.yScaleType !== 'band') {
      this.drawPanel
        .select('.interactiveDraw')
        .selectAll('circle')
        .style('opacity', (d, i) => (!data[i] || !mouseover || data[i].disabled || !data[i].cy ? 0 : 1))
        .style('stroke', (d, i) => data[i] && data[i].color)
        .attr('fill', (d, i) => data[i] && data[i].color)
        .attr('cx', x)
        .attr('cy', (d, i) => data[i] && data[i].cy);
    }
  }

  private getInteractiveData(idx: number): GnroD3Interactive[] {
    const ndata: GnroD3Interactive[] = [];
    this.draw
      .data$()
      .filter((d: any) => !d.disabled)
      .forEach((d: any, i) => {
        this.draw.draws.forEach((draw) => {
          // console.log( 'draws=', draw);
          const drawdata = draw.getInteractiveData(idx, d);
          if (drawdata) {
            ndata.push(...drawdata);
          }
        });
      });
    return ndata;
  }

  private getPopoverData(data: GnroD3Interactive[]): GnroD3Popover {
    let reverse = false;
    let hasSummary = false;
    let val = '';
    let total = 0;
    const sd: GnroD3PopoverSerie[] = data
      .filter((d) => d.value)
      .map((d, i) => {
        val = d.valueX;
        let svalue = '';
        reverse = d.reverse!;
        hasSummary = d.hasSummary;
        total += d.hasSummary ? +d.valueY : 0;
        if (d.normalized) {
          svalue = `${this.configs.popover!.normalizedFormatter!(+d.valueY * 100)}%`;
          if (d.value.data) {
            hasSummary = true;
            const avalue = d.value.data[d.key];
            total += +avalue;
            svalue += ` (${this.configs.popover!.valueFormatter!(avalue)})`;
          }
        } else {
          svalue = this.configs.popover!.valueFormatter ? this.configs.popover!.valueFormatter(+d.valueY) : d.valueY;
        }
        return {
          key: this.configs.popover!.serieFormatter!(d.key),
          value: svalue,
          color: d.color,
          hovered: d.hovered,
        };
      });
    if (reverse) {
      sd.reverse();
    }
    if (hasSummary) {
      sd.push({
        key: this.configs.popover!.totalLable!,
        value: this.configs.popover!.valueFormatter!(total),
      });
    }
    return {
      value: this.configs.popover!.axisFormatter!(val),
      series: sd,
    };
  }
}
