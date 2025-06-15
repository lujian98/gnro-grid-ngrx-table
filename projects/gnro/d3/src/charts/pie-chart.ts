import * as d3Shape from 'd3-shape';
import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroPieData } from '../data/pie-data';
import { GnroScale, GnroScaleLinear, GnroD3Interactive, GnroPosition } from '../models';

export class GnroPieChart<T> extends GnroAbstractDraw<T> {
  private sxy!: GnroPosition;
  private outterRadius!: number;

  // @ts-ignore
  getDrawData(idx: number, data: T): GnroD3Interactive[] {
    // @ts-ignore
    return this.chart
      .y0(data)
      .filter((d: any) => idx > -1 && !d.disabled)
      .map((d: any, i: number) => {
        return {
          key: this.chart.x!(d),
          value: d,
          color: d.color || this.getdrawColor(d, i),
          valueX: null,
          valueY: this.chart.y!(d),
          cy: null,
          hovered: i === idx,
          hasSummary: true,
        };
      });
  }

  // @ts-ignore
  drawChart(data: T[]): void {
    const pie = new GnroPieData(this.chart);
    // @ts-ignore
    pie.pieOptions = this.chart.pie;
    this.sxy = pie.setPieScaleXY();
    this.outterRadius = Math.round(
      Math.min((Math.abs(this.sxy.x) + 1) * this.panelWidth, (Math.abs(this.sxy.y) + 1) * this.panelHeight) / 2,
    );
    const piedata = pie.getPieData(this.chart.y0!(data[0]));
    this.createDrawElement('pieChartLabel');
    super.drawChart(piedata);
  }

  drawContents(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    this.drawPanel
      .select(drawName)
      .selectAll('g')
      .data(this.data)
      .join('g')
      .append('path')
      .attr('class', 'arc draw')
      .style('fill-opacity', 0.75);
    this.drawPanel
      .select(`${drawName}Label`)
      .selectAll('g')
      .data(this.data)
      .join('g')
      .append('text')
      .attr('class', 'drawlabel');
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const cx = ((this.sxy.x + 1) * this.panelWidth) / 2 + this.outterRadius * this.chart.pie!.centerOffsetX!;
    const cy = ((this.sxy.y + 1) * this.panelHeight) / 2 + this.outterRadius * this.chart.pie!.centerOffsetY!;
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .select('.draw')
      .attr('transform', () => `translate(${cx}, ${cy})`)
      // @ts-ignore
      .attr('d', this.drawArc())
      .attr('fill', (d: any, i) => this.getdrawColor(d.data, i));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
    }
    const textSize = this.outterRadius * this.chart.pie!.labelTextSize!;
    this.drawPanel
      .select(`${drawName}Label`)
      .selectAll('g')
      .select('.drawlabel')
      .text((d: any) => this.chart.x!(d.data))
      .style('font', `${textSize}px Courier`)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', (d: any) => {
        const center = this.drawArc().centroid(d);
        center[0] = center[0] + cx;
        center[1] = center[1] + cy;
        const avg = (d.startAngle + d.endAngle) / 2;
        const angle = avg - 2 * Math.PI * Math.floor(avg / (2 * Math.PI));
        const midAngle = angle < Math.PI ? angle : angle + Math.PI;
        return `translate(${center}) rotate(-90) rotate(${(midAngle * 180) / Math.PI})`;
      });
  }

  drawArc(grow: number = 0): d3Shape.Arc<any, d3Shape.DefaultArcObject> {
    return d3Shape
      .arc()
      .innerRadius(this.outterRadius * Math.min(0.95, this.chart.pie!.donut!))
      .outerRadius(this.outterRadius - 10 + grow);
  }

  drawMouseover(e: any, data: any, mouseover: boolean): void {
    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('g')
      .select('.draw')
      // @ts-ignore
      .filter((d: any) => {
        if (d.index === data.index) {
          if (mouseover) {
            this.hoveredKey = this.chart.x!(d.data);
            this.hoveredIndex = d.index;
          } else {
            // @ts-ignore
            this.hoveredKey = null;
            this.hoveredIndex = -1;
          }
          return true;
        }
      })
      // @ts-ignore
      .transition()
      .duration(50)
      .style('fill-opacity', () => (mouseover ? 0.9 : 0.75))
      // @ts-ignore
      .attr('d', mouseover ? this.drawArc(7) : this.drawArc());
  }

  legendMouseover(e: any, data: any, mouseover: boolean): void {
    this.drawPanel
      .select(`.${this.chartType}`)
      .selectAll('g')
      .select('.draw')
      .filter((d: any) => [d.data].indexOf(data) !== -1)
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75))
      // @ts-ignore
      .attr('d', mouseover ? this.drawArc(5) : this.drawArc());
  }
}
