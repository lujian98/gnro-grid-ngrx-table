import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroScale, GnroScaleLinear } from '../models';

export class GnroBarChart<T> extends GnroAbstractDraw<T> {
  // @ts-ignore
  protected hoveredIndex = -1;

  setHovered(e: any, d: any): void {
    const index = this.getHoveredIndex(e);
    this.hoveredKey = this.chart.x0!(this.data[index.idx]);
    this.hoveredIndex = index.jdx;
  }

  drawContents(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .data(this.data)
      .join('g')
      .attr('fill', (d, i) => this.getdrawColor(d, i));

    if (drawName === `.${this.chartType}`) {
      drawContents.attr('class', 'barChart series').style('fill-opacity', 0.75);
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const barWidth = this.scale.getXBarWidth(scaleX, this.scaleX, this.chart, this.data);
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('rect')
      .data((d) => this.chart.y0!(d))
      .join('rect')
      .attr('class', 'bar draw')
      .attr('fill', (d, i) => this.getBarColor(d, i))
      // @ts-ignore
      .attr('x', (d: any, i: number) => scaleX(this.chart.x(d)))
      .attr('width', barWidth);
    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }
    if (this.isAnimation && this.chart.duration! > 0) {
      drawContents
        .attr('y', (d, i) => scaleY(0))
        .attr('height', (d, i) => 0)
        // @ts-ignore
        .transition()
        .duration(this.chart.duration!)
        // @ts-ignore
        .attr('y', (d, i) => scaleY(Math.max(0, this.chart.y!(d))))
        // @ts-ignore
        .attr('height', (d, i) => scaleY(0) - scaleY(Math.abs(this.chart.y!(d))));
    } else {
      drawContents
        .attr('y', (d, i) => scaleY(Math.max(0, this.chart.y!(d))))
        .attr('height', (d, i) => scaleY(0) - scaleY(Math.abs(this.chart.y!(d))));
    }
  }

  legendMouseover(e: any, data: any, mouseover: boolean): void {
    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('g')
      .selectAll('.draw')
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
      .filter((d) => this.chart.x!(d) === this.chart.x!(data))
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75));
  }
}
