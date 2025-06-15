import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroGroupedData } from '../data/grouped-data';
import { GnroScaleLinear, GnroScaleBand } from '../models';

export class GnroGroupedBarChart<T> extends GnroAbstractDraw<T> {
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
  drawChart(data: T[]): void {
    const grouped = new GnroGroupedData(this.chart);
    const groupeddata = grouped.getGroupedData(data, true);
    super.drawChart(groupeddata);
  }

  drawContents(drawName: string, scaleX: GnroScaleBand, scaleY: GnroScaleLinear, xGroup: GnroScaleBand): void {
    this.chart.useInteractiveGuideline = false;
    const groupName = drawName.replace('.', '');
    this.drawPanel.select(drawName).selectAll('g').data(this.data).join('g').attr('class', `${groupName}Group`);
    this.redrawContent(drawName, scaleX, scaleY, xGroup);
  }

  redrawContent(drawName: string, scaleX: GnroScaleBand, scaleY: GnroScaleLinear, xGroup: GnroScaleBand): void {
    if (drawName === `.${this.chartType}` && scaleX.bandwidth) {
      // only support band scale
      xGroup.rangeRound([0, scaleX.bandwidth()]);
    }

    this.drawPanel
      .selectAll(`${drawName}Group`)
      .attr('transform', (d) => 'translate(' + scaleX(this.chart.x!(d)) + ',0)');

    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .selectAll('rect')
      .data((d) => this.chart.y0!(d))
      .join('rect')
      .attr('class', 'groupbar draw')
      .style('fill-opacity', 0.75)
      .attr('fill', (d, i) => this.getdrawColor(d, i))
      .attr('x', (d) => xGroup(this.chart.x0!(d))!)
      .attr('y', (d) => scaleY(Math.max(0, this.chart.y!(d))))
      .attr('width', xGroup.bandwidth())
      .attr('height', (d) => scaleY(0) - scaleY(Math.abs(this.chart.y!(d))));

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
      .select(`.${this.chartType}`)
      .selectAll('g')
      .selectAll('.draw')
      .filter(
        (d) =>
          this.chart.x0!(d) === this.chart.x0!(data) &&
          ((!this.chart.y0!(data) && this.chart.y!(d) === this.chart.y!(data)) || this.chart.y0!(data)),
      )
      .style('fill-opacity', (d) => (mouseover ? 0.9 : 0.75));
  }
}
