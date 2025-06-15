import { IccHorizontalBarChart, IccScale, IccScaleLinear } from '@icc/ui/d3';
import * as d3Transition from 'd3-transition';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Format from 'd3-format';
import * as d3Ease from 'd3-ease';

export class AppHorizontalBarChart<T> extends IccHorizontalBarChart<T> {
  override redrawContent(drawName: string, scaleX: IccScaleLinear, scaleY: IccScale): void {
    const height = this.scale.getYBarHeight(scaleY, this.scaleY, this.chart, this.data);
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('rect')
      .data((d) => this.chart.y0!(d))
      .join('rect')
      .attr('class', 'horizontalbar draw')
      .attr('fill', (d: any, i) => this.getBarColor(d, i))
      .attr('fill-opacity', 0.6)
      .attr('y', (d) => scaleY(this.chart.y!(d))!)
      .attr('height', height);

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));

      this.drawPanel
        .select(drawName)
        .selectAll('g')
        .selectAll('text')
        .data((d) => this.chart.y0!(d))
        .join('text')
        .attr('class', 'label')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .attr('fill', (d, i) => 'black')
        .attr('y', (d) => scaleY(this.chart.y!(d))! + height / 2)
        .attr('x', (d, i) => scaleX(Math.abs(this.chart.x!(d))) - scaleX(0) - 6)
        .text((d: any) => {
          return d.name;
        })
        .call((text) =>
          text
            .append('tspan')
            .attr('y', (d) => scaleY(this.chart.y!(d))! + height / 2)
            .attr('x', (d, i) => scaleX(Math.abs(this.chart.x!(d))) - scaleX(0) - 6)
            .attr('text-anchor', 'end')
            .attr('fill-opacity', 0.7)
            .attr('font-weight', 'normal')
            // .attr('x', -6)
            .attr('dy', '1.15em'),
        );

      this.drawPanel
        .select(drawName)
        .selectAll('g')
        .selectAll('tspan')
        .transition()
        .duration(500)
        .ease(d3Ease.easeLinear)
        .tween('text', (d: any, i) => {
          let start = 0;
          if (this.prevData) {
            const data = this.chart.y0!(this.prevData[0]).filter((t: any, j: any) => i === j);
            if (data.length > 0) {
              start = +data[0].value;
            }
          }
          // const tt = this.textTween(start, +d.value);
          // console.log(' tt =', tt)
          return this.textTween(start, +d.value);
        });
    }

    if (this.isAnimation && this.chart.duration! > 0) {
      drawContents
        .attr('x', (d, i) => scaleX(0))
        .attr('width', (d, i) => 0)
        .transition()
        .duration(this.chart.duration!)
        .attr('x', (d, i) => scaleX(Math.min(0, this.chart.x!(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.chart.x!(d))) - scaleX(0));
    } else {
      drawContents
        .attr('x', (d, i) => scaleX(Math.min(0, this.chart.x!(d))))
        .attr('width', (d, i) => scaleX(Math.abs(this.chart.x!(d))) - scaleX(0));
    }
  }

  textTween(a: any, b: any): any {
    const i = d3Interpolate.interpolateNumber(a, b);
    return function (t: any) {
      // @ts-ignore
      this.textContent = d3Format.format(',d')(i(t));
    };
  }
}
