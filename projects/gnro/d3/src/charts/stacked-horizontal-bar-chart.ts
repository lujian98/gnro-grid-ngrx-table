import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroStackedData } from '../data/stacked-data';
import { GnroScale, GnroScaleLinear, GnroD3Interactive } from '../models';

export class GnroStackedHorizontalBarChart<T> extends GnroAbstractDraw<T> {
  // @ts-ignore
  protected hoveredIndex = -1;
  drawData!: T[];

  setHovered(e: any, d: any): void {
    const index = this.getHoveredIndex(e);
    const data: any = this.data[index.idx];
    this.hoveredKey = data.key;
    this.hoveredIndex = index.jdx;
  }

  // @ts-ignore
  setValueXY(r: GnroD3Interactive, idx: number): void {
    r.valueX = this.chart.y!(r.value.data);
  }

  // @ts-ignore
  drawChart(data: T[]): void {
    this.drawData = data;
    this.isStacked = true;
    const stacked = new GnroStackedData(this.drawPanel, this.scale, this.chart, this.chartType);
    this.normalized = stacked.normalized;
    const stackdata = data.length > 0 ? stacked.getStackedData(data, false) : [];
    if (data.length > 0) {
      stacked.setStackedXDomain(stackdata);
    }
    super.drawChart(stackdata);
  }

  drawContents(drawName: string, scaleX: GnroScaleLinear, scaleY: GnroScale): void {
    this.chart.useInteractiveGuideline = false;
    this.drawPanel
      .select(drawName)
      .selectAll('g')
      .data(this.data)
      .join('g')
      .attr('class', 'stackedhorizontalbar series')
      .attr('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getStackeddrawColor(d, i));
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScaleLinear, scaleY: GnroScale): void {
    const height = this.scale.getYBarHeight(scaleY, this.scaleY, this.chart, this.drawData);
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('rect')
      .data((d: any) => d)
      .join('rect')
      .attr('class', 'stackedhorizontalbar draw')
      // @ts-ignore
      .attr('x', (d) => scaleX(d[0]))
      .attr('y', (d: any) => scaleY(this.chart.y!(d.data))!)
      .attr('height', height)
      // @ts-ignore
      .attr('width', (d, i) => scaleX(d[1]) - scaleX(d[0]));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }
  }

  legendMouseover(e: any, data: any, mouseover: boolean): void {
    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('g')
      .selectAll('.draw')
      .style('fill-opacity', () => (mouseover ? null : 0.75));

    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('.series')
      .filter((d: any) => d.key === this.chart.x0!(data))
      .style('fill-opacity', (d) => (mouseover ? 0.9 : null));
  }

  drawMouseover(e: any, data: any, mouseover: boolean): void {
    if (mouseover) {
      this.setHovered(e, data);
    } else {
      // @ts-ignore
      this.hoveredKey = null;
      this.hoveredIndex = -1;
    }
    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('g')
      .selectAll('.draw')
      .filter((d: any) => data.data && this.chart.y!(d.data) === this.chart.y!(data.data))
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75));
  }
}
