import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroScale, GnroScaleLinear, GnroD3Interactive } from '../models';

export class GnroHorizontalBarChart<T> extends GnroAbstractDraw<T> {
  // @ts-ignore
  protected hoveredIndex = -1;

  setHovered(e: any, d: any): void {
    const index = this.getHoveredIndex(e);
    this.hoveredKey = this.chart.x0!(this.data[index.idx]);
    this.hoveredIndex = index.jdx;
  }

  // @ts-ignore
  setValueXY(r: GnroD3Interactive, idx: number): void {
    r.valueX = this.chart.y!(r.value[0]);
    r.valueY = this.chart.x!(r.value[0]);
  }

  drawContents(drawName: string, scaleX: GnroScaleLinear, scaleY: GnroScale): void {
    this.chart.useInteractiveGuideline = false;
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .data(this.data)
      .join('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    if (drawName === `.${this.chartType}`) {
      drawContents.attr('class', 'horizontalbar series').style('fill-opacity', 0.75);
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScaleLinear, scaleY: GnroScale): void {
    const height = this.scale.getYBarHeight(scaleY, this.scaleY, this.chart, this.data);
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('rect')
      .data((d) => this.chart.y0!(d))
      .join('rect')
      .attr('class', 'horizontalbar draw')
      .attr('fill', (d, i) => this.getBarColor(d, i))
      .attr('y', (d) => scaleY(this.chart.y!(d))!)
      .attr('height', height);

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }

    if (this.isAnimation && this.chart.duration! > 0) {
      drawContents
        .attr('x', (d, i) => scaleX(0))
        .attr('width', (d, i) => 0)
        // @ts-ignore
        .transition()
        .duration(this.chart.duration!)
        // @ts-ignore
        .attr('x', (d, i) => scaleX(Math.min(0, this.chart.x!(d))))
        // @ts-ignore
        .attr('width', (d, i) => scaleX(Math.abs(this.chart.x!(d))) - scaleX(0));
    } else {
      drawContents
        .attr('x', (d, i) => scaleX(Math.min(0, this.chart.x!(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.chart.x!(d))) - scaleX(0));
    }
  }

  legendMouseover(e: any, data: any, mouseover: boolean): void {
    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('g')
      .select('.draw')
      .style('fill-opacity', (d) => (mouseover ? null : 0.75));

    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('.series')
      .filter((d, i) => this.chart.x0!(d) === this.chart.x0!(data))
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75));
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
      .filter((d) => this.chart.y!(d) === this.chart.y!(data))
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75));
  }
}
