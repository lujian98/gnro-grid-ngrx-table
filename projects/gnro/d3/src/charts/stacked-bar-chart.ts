import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroStackedData } from '../data/stacked-data';
import { GnroScale, GnroScaleLinear } from '../models';

export class GnroStackedBarChart<T> extends GnroAbstractDraw<T> {
  // @ts-ignore
  protected hoveredIndex = -1;
  drawData!: T[];

  setHovered(e: any, d: any): void {
    const index = this.getHoveredIndex(e);
    const data: any = this.data[index.idx];
    this.hoveredKey = data.key; // this only difference
    this.hoveredIndex = index.jdx;
  }

  // @ts-ignore
  drawChart(data: T[]): void {
    this.drawData = data;
    this.isStacked = true;
    this.reverse = true;
    const stacked = new GnroStackedData(this.drawPanel, this.scale, this.chart, this.chartType);
    this.normalized = stacked.normalized;
    const stackdata = data.length > 0 ? stacked.getStackedData(data, true) : [];
    if (data.length > 0) {
      stacked.setStackedYDomain(stackdata);
    }
    super.drawChart(stackdata);
  }

  drawContents(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    this.chart.useInteractiveGuideline = false;
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .data(this.data)
      .join('g')
      .attr('class', 'stackedbar series')
      .attr('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getStackeddrawColor(d, i));
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const barWidth = this.scale.getXBarWidth(scaleX, this.scaleX, this.chart, this.drawData);
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('rect')
      .data((d: any) => d)
      .join('rect')
      .attr('class', 'stackedbar draw')
      .attr('x', (d: any) => scaleX(this.chart.x!(d.data))!)
      // @ts-ignore
      .attr('y', (d) => scaleY(d[1]))
      // @ts-ignore
      .attr('height', (d) => scaleY(d[0]) - scaleY(d[1]))
      .attr('width', barWidth);
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
      .filter((d: any) => d.key === this.chart.x0!(data)) // key is from stacked data
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
      .filter((d: any) => data.data && this.chart.x!(d.data) === this.chart.x!(data.data))
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75));
  }
}
