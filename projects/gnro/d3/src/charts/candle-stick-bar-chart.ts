import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroScale, GnroScaleLinear } from '../models';

export class GnroCandleStickBarChart<T> extends GnroAbstractDraw<T> {
  drawContents(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    this.drawPanel.select(drawName).selectAll('g').data(this.data).join('g');
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const barWidth = this.getBarWidth(drawName, scaleX);

    this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('rect')
      .data((d) => this.chart.y0!(d))
      .join('rect')
      .attr('class', 'candlestick draw')
      // @ts-ignore
      .attr('x', (d, i) => scaleX(this.chart.x(d)))
      .attr('y', (d: any) => scaleY(Math.max(d.open, d.close)))
      .attr('width', barWidth)
      .attr('height', (d: any) => {
        return d.open === d.close ? 1 : scaleY(Math.min(d.open, d.close)) - scaleY(Math.max(d.open, d.close));
      })
      .attr('fill', (d: any) => (d.open === d.close ? 'silver' : d.open > d.close ? 'red' : 'green'));

    this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('line')
      .data((d) => this.chart.y0!(d))
      .join('line')
      .attr('class', 'candlestick stem')
      // @ts-ignore
      .attr('x1', (d, i) => scaleX(this.chart.x(d)) + barWidth / 2)
      // @ts-ignore
      .attr('x2', (d, i) => scaleX(this.chart.x(d)) + barWidth / 2)
      .attr('y1', (d: any) => scaleY(d.high))
      .attr('y2', (d: any) => scaleY(d.low))
      .attr('stroke', (d: any) => (d.open === d.close ? 'white' : d.open > d.close ? 'red' : 'green'));
  }

  legendMouseover(e: any, data: any, mouseover: boolean): void {
    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('g')
      .select('.draw')
      .filter(
        (d: any) =>
          this.chart.x0!(d) === this.chart.x0!(data) &&
          ((!this.chart.y0!(data) && this.chart.y!(d) === this.chart.y!(data)) || this.chart.y0!(data)),
      )
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75));
  }

  getBarWidth(drawName: string, scaleX: GnroScale): any {
    if (this.data.length > 0) {
      const range = scaleX.range();
      const barWidth = (range[1] / this.chart.y0!(this.data[0]).length) * 0.45;
      let scale = 1;
      if (drawName === `.${this.chartType}`) {
        const xdomain = scaleX.domain() as any[];
        scale = (range[1] - range[0]) / (this.scaleX.brushX(xdomain[1]) - this.scaleX.brushX(xdomain[0]));
      }
      return Math.max(1, barWidth * scale);
    }
  }
}
