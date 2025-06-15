import * as d3Shape from 'd3-shape';
import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroScale, GnroScaleLinear } from '../models';

export class GnroLineChart<T> extends GnroAbstractDraw<T> {
  drawContents(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .data(this.data)
      .join('g')
      .append('path')
      .attr('class', 'line draw');

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.legendMouseover(e, d, true))
        .on('mouseout', (e, d) => this.legendMouseover(e, d, false));
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const drawLine = d3Shape
      .line()
      // @ts-ignore
      .x((d) => scaleX(this.chart.x!(d)))
      .y((d) => scaleY(this.chart.y!(d)));
    const drawContent = (d: any) => drawLine(this.chart.y0!(d));
    this.drawPanel
      .select(drawName)
      .selectAll('g')
      .select('.draw')
      .style('stroke', (d, i) => this.getdrawColor(d, i))
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
      .attr('stroke-width', (d) => (mouseover ? 2.0 : 1.0));
  }
}
