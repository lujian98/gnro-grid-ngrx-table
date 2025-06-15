import * as d3Shape from 'd3-shape';
import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroScale, GnroScaleLinear } from '../models';

export class GnroAreaChart<T> extends GnroAbstractDraw<T> {
  drawContents(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .data(this.data)
      .join('g')
      .append('path')
      .attr('stroke-width', 1.0)
      .attr('class', 'area draw')
      .attr('fill-opacity', 0.5);
    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.legendMouseover(e, d, true))
        .on('mouseout', (e, d) => this.legendMouseover(e, d, false));
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const drawArea = d3Shape
      .area()
      .curve(d3Shape.curveLinear)
      .defined((d, i) => !isNaN(this.chart.y!(d)) && this.chart.y!(d) !== null)
      // @ts-ignore
      .x((d) => scaleX(this.chart.x!(d)))
      .y0(() => (scaleY.domain()[0] < 0 ? scaleY(0) : scaleY.range()[0]))
      .y1((d) => scaleY(this.chart.y!(d)));
    const drawContent = (d: any) => drawArea(this.chart.y0!(d));
    this.drawPanel
      .select(drawName)
      .selectAll('g')
      .select('.draw')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('d', drawContent);
  }

  legendMouseover(e: any, data: any, mouseover: boolean): void {
    if (e) {
      this.hoveredKey = mouseover ? this.chart.x0!(data) : null;
    }
    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('g')
      .select('.draw')
      .filter((d) => this.chart.x0!(d) === this.chart.x0!(data))
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.5));
  }
}
