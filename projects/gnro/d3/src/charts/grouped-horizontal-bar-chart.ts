import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroGroupedData } from '../data/grouped-data';
import { GnroScaleLinear, GnroScaleBand, GnroD3Interactive } from '../models';

export class GnroGroupedHorizontalBarChart<T> extends GnroAbstractDraw<T> {
  // @ts-ignore
  protected hoveredIndex = -1;
  // @ts-ignore
  protected isGrouped = true;

  setHovered(e: any, d: any): void {
    const index = this.getHoveredIndex(e);
    const pd = this.data[index.idx];
    const nd = this.chart.y0!(pd);
    this.hoveredIndex = index.idx;
    this.hoveredKey = this.chart.x0!(nd[index.jdx]);
  }

  // @ts-ignore
  setValueXY(r: GnroD3Interactive, idx: number): void {
    r.valueX = this.chart.y!(r.value[0]);
    r.valueY = this.chart.x!(r.value[0]);
  }

  // @ts-ignore
  drawChart(data: T[]): void {
    const grouped = new GnroGroupedData(this.chart);
    const groupeddata = grouped.getGroupedData(data, false);
    super.drawChart(groupeddata);
  }

  drawContents(
    drawName: string,
    scaleX: GnroScaleLinear,
    scaleY: GnroScaleBand,
    xGroup: GnroScaleBand,
    yGroup: GnroScaleBand,
  ): void {
    this.chart.useInteractiveGuideline = false;
    const groupName = drawName.replace('.', '');
    this.drawPanel.select(drawName).selectAll('g').data(this.data).join('g').attr('class', `${groupName}Group`);
    this.redrawContent(drawName, scaleX, scaleY, xGroup, yGroup);
  }

  redrawContent(
    drawName: string,
    scaleX: GnroScaleLinear,
    scaleY: GnroScaleBand,
    xGroup: GnroScaleBand,
    yGroup: GnroScaleBand,
  ): void {
    if (drawName === `.${this.chartType}` && scaleY.bandwidth) {
      // only support band scale
      yGroup.rangeRound([0, scaleY.bandwidth()]);
    }

    this.drawPanel
      .selectAll(`${drawName}Group`)
      .attr('transform', (d) => 'translate(0, ' + scaleY(this.chart.y!(d)) + ')');

    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('rect')
      .data((d) => this.chart.y0!(d))
      .join('rect')
      .attr('class', 'groupbar draw')
      .style('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('y', (d) => yGroup(this.chart.x0!(d))!) /// MUST BE this.chart.x0(d)
      .attr('x', (d) => scaleX(Math.min(0, this.chart.x!(d))))
      .attr('height', yGroup.bandwidth())
      .attr('width', (d) => scaleX(Math.abs(this.chart.x!(d))) - scaleX(0));

    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.legendMouseover(e, d, true))
        .on('mouseout', (e, d) => this.legendMouseover(e, d, false));
    }
  }

  legendMouseover(e: any, data: any, mouseover: boolean): void {
    if (e) {
      if (mouseover) {
        this.setHovered(e, data);
      } else {
        // @ts-ignore
        this.hoveredKey = null;
        this.hoveredIndex = -1;
      }
    }
    this.drawPanel
      .select('.groupedHorizontalBarChart')
      .selectAll('g')
      .selectAll('.draw')
      .filter(
        (d) =>
          this.chart.x0!(d) === this.chart.x0!(data) &&
          ((!this.chart.y0!(data) && this.chart.x!(d) === this.chart.x!(data)) || this.chart.y0!(data)),
      )
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75));
  }
}
