import * as d3Array from 'd3-array';
import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroScaleLinear, GnroD3Range, GnroD3BulletChartData } from '../models';
import { GnroUtils } from '../utils/utils';

export class GnrobulletChart<T> extends GnroAbstractDraw<T> {
  setRangeScale(data: GnroD3BulletChartData[]): void {
    const minv = d3Array.min(data, (c) => d3Array.min(c.range!, (d) => d.value));
    const maxv = d3Array.max(data, (c) => d3Array.max(c.range!, (d) => d.value));
    if (this.chart.bullet!.type === 'horizontal') {
      this.scaleX.value.domain([minv, maxv]);
      this.scaleX.brushX.domain([minv, maxv]);
      // @ts-ignore
      this.drawPanel.select('.axis--x').call(this.scale.scaleX.axis);
      // @ts-ignore
      this.drawPanel.select('.axis--xgrid').call(this.scale.scaleX.grid);
    } else if (this.chart.bullet!.type === 'vertical') {
      this.scaleY.value.domain([minv, maxv]);
      this.scaleY.brushY.domain([minv, maxv]);
      // @ts-ignore
      this.drawPanel.select('.axis--y').call(this.scale.scaleY.axis);
      // @ts-ignore
      this.drawPanel.select('.axis--ygrid').call(this.scale.scaleY.grid);
    }
  }

  private getRangeData(data: GnroD3Range[]): GnroD3Range[] {
    const range = GnroUtils.dataSortByField(data, 'value', 'asc');
    return range
      .filter((d, i) => i > 0)
      .map((d, i) => {
        return {
          label: d.label,
          minv: range[i].value,
          maxv: d.value,
          color: d.color,
        };
      });
  }

  private getMeasuredRange(data: GnroD3Range[], optionX: Function, minv: number): GnroD3Range[] {
    data = GnroUtils.dataSortByField(data, optionX, 'asc');
    const ndata = data.map((d, i) => {
      const p = { ...d };
      p.minv = i === 0 ? minv : optionX(data[i - 1]);
      return p;
    });
    return ndata;
  }

  drawContents(drawName: string, scaleX: GnroScaleLinear, scaleY: GnroScaleLinear): void {
    this.setRangeScale(this.data);
    this.createDrawElement('bulletMeasures', true);
    this.createDrawElement('bulletMarkers', true);
    this.createDrawElement('bulletMarkerLines', true);
    this.drawPanel.select(drawName).selectAll('g').data(this.data).join('g');
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScaleLinear, scaleY: GnroScaleLinear): void {
    const data: GnroD3BulletChartData = this.data[0];
    const range = this.getRangeData(data.range!);
    if (this.chart.bullet!.type === 'horizontal') {
      this.drawHorizontalRange(drawName, scaleX, range);
      this.drawHorizontalMeasures(data, scaleX);
      this.drawHorizontalMakerLines(data.markerLines!);
    } else if (this.chart.bullet!.type === 'vertical') {
      this.drawVerticalRange(drawName, scaleY, range);
      this.drawVerticalMeasures(data, scaleY);
      this.drawVerticalMakerLines(data.markerLines!);
    }
  }

  private drawVerticalMakerLines(data: T[]): void {
    this.drawPanel
      .select('.bulletMarkerLines')
      .selectAll('line.markerLine')
      .data(data || [])
      .join('line')
      .attr('class', 'markerLine')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', this.chart.bullet!.markerLineWidth!)
      .attr('x1', 2)
      .attr('y1', (d) => this.scaleY.value(this.chart.y!(d)))
      .attr('x2', this.panelWidth - 2)
      .attr('y2', (d) => this.scaleY.value(this.chart.y!(d)));
  }

  private drawVerticalRange(drawName: string, scaleY: GnroScaleLinear, range: GnroD3Range[]): void {
    this.drawPanel
      .select(drawName)
      .selectAll('rect')
      .data(range)
      .join('rect')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('width', this.panelWidth)
      .attr('y', (d, i) => scaleY(d.maxv!))
      .attr('height', (d, i) => scaleY(d.minv!) - scaleY(d.maxv!));
  }

  private drawVerticalMeasures(data: GnroD3BulletChartData, scaleY: GnroScaleLinear): void {
    const measures = this.getMeasuredRange(this.chart.y0!(data), this.chart.y!, scaleY.domain()[0]) || [];
    this.drawPanel
      .select('.bulletMeasures')
      .selectAll('rect')
      .data(measures)
      .join('rect')
      .attr('fill', (d) => d.color!)
      .attr('width', this.panelWidth / 3)
      .attr('x', this.panelWidth / 3)
      .attr('y', (d) => scaleY(this.chart.y!(d)))
      .attr('height', (d) => {
        const h = scaleY(d.minv!) - scaleY(this.chart.y!(d));
        return h > 0 ? h : 0;
      });
    const h3 = this.panelWidth / 6 - 1;
    this.drawPanel
      .select('.bulletMarkers')
      .selectAll('path.markerTriangle')
      .data(measures)
      .join('path')
      .attr('class', 'markerTriangle')
      .attr('fill', (d) => d.color!)
      .attr('d', `M${h3},0L${-h3},${-h3} ${-h3},${h3}Z`)
      .attr('transform', (d, i) => {
        const dh = i % 2 === 0 ? 2 * (h3 + 0.5) : -2 * (h3 + 0.5);
        const r = i % 2 === 0 ? 180 : 0;
        return `translate(${dh + this.panelWidth / 2}, ${this.scaleY.value(this.chart.y!(d))}) rotate(${r})`;
      });
  }

  private drawHorizontalRange(drawName: string, scaleX: GnroScaleLinear, range: GnroD3Range[]): void {
    this.drawPanel
      .select(drawName)
      .selectAll('rect')
      .data(range)
      .join('rect')
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('width', (d) => {
        const w = scaleX(d.maxv!) - scaleX(d.minv!);
        return w > 0 ? w : 0;
      })
      .attr('height', this.panelHeight)
      .attr('x', (d) => scaleX(d.minv!));
  }

  private drawHorizontalMeasures(data: GnroD3BulletChartData, scaleX: GnroScaleLinear): void {
    const measures = this.getMeasuredRange(this.chart.y0!(data), this.chart.x!, scaleX.domain()[0]) || [];
    this.drawPanel
      .select('.bulletMeasures')
      .selectAll('rect')
      .data(measures)
      .join('rect')
      .attr('fill', (d) => d.color!)
      .attr('width', (d) => {
        const w = scaleX(this.chart.x!(d)) - scaleX(d.minv!);
        return w > 0 ? w : 0;
      })
      .attr('height', this.panelHeight / 3)
      .attr('y', this.panelHeight / 3)
      .attr('x', (d) => scaleX(d.minv!));

    const h3 = this.panelHeight / 6 - 1;
    this.drawPanel
      .select('.bulletMarkers')
      .selectAll('path.markerTriangle')
      .data(measures)
      .join('path')
      .attr('class', 'markerTriangle')
      .attr('fill', (d) => d.color!)
      .attr('d', `M0,${h3}L${h3},${-h3} ${-h3},${-h3}Z`)
      .attr('transform', (d, i) => {
        const dh = i % 2 === 0 ? 2 * (h3 + 0.5) : -2 * (h3 + 0.5);
        const r = i % 2 === 0 ? 180 : 0;
        return `translate(${this.scale.scaleX.value!(this.chart.x!(d))}, ${dh + this.panelHeight / 2}) rotate(${r})`;
      });
  }

  private drawHorizontalMakerLines(data: T[]): void {
    this.drawPanel
      .select('.bulletMarkerLines')
      .selectAll('line.markerLine')
      .data(data || [])
      .join('line')
      .attr('class', 'markerLine')
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', this.chart.bullet!.markerLineWidth!)
      // @ts-ignore
      .attr('x1', (d) => this.scale.scaleX.value(this.chart.x(d)))
      .attr('y1', 2)
      // @ts-ignore
      .attr('x2', (d) => this.scale.scaleX.value(this.chart.x(d)))
      .attr('y2', this.panelHeight - 2);
  }

  legendMouseover(e: any, data: any, mouseover: boolean): void {}
}
