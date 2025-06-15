import * as d3 from 'd3-selection';
import * as d3Axis from 'd3-axis';
import { GnroD3ChartConfig } from '../models';
import { GnroScaleDraw, GnroView } from '.';

export class GnroAxisDraw<T> {
  private drawID!: number;

  constructor(
    protected view: GnroView,
    private scale: GnroScaleDraw<T>,
    private chartConfigs: GnroD3ChartConfig[],
  ) {
    if (this.configs.axisEnabled) {
      this.drawID = Math.floor(Math.random() * 100000);
      this.init();
      this.update();
    }
  }

  get configs(): GnroD3ChartConfig {
    // TODO other charts if need only for X axis for now
    return this.chartConfigs[0];
  }

  get drawPanel(): d3.Selection<d3.BaseType, {}, HTMLElement, any> {
    const panelId = this.configs.panelId; // TODO other charts if need only for X axis for now
    return this.view.svg.select(`.panel${panelId}`);
  }

  get panelHeight(): number {
    return this.view.getPanelHeight(this.configs.panelId!);
  }

  get panelWidth(): number {
    return this.view.getPanelWidth(this.configs.panelId!);
  }

  init(): void {
    this.drawXAxis();
    this.drawYAxis();
  }

  update(): void {
    this.updateXAxis();
    this.updateYAxis();
    // @ts-ignore
    this.drawPanel.select('.context').select('.axis--x').call(this.scale.scaleX.brushXAxis);
    // @ts-ignore
    this.drawPanel.select('.contextBrushY').select('.axis--y').call(this.scale.scaleY.brushYAxis);
  }

  updateXAxis(): void {
    const xAxisDraw = this.drawPanel.select('.xAxisDraw');
    const y0 = this.configs.xAxis?.position === 'top' ? 0 : this.panelHeight;
    xAxisDraw
      .select('.axis--x')
      .attr('transform', `translate(0, ${y0})`)
      // @ts-ignore
      .call(this.scale.scaleX.axis.tickSize(this.configs.xAxis.tickSize).tickPadding(this.configs.xAxis?.tickPadding!));
    if (this.configs.xAxis?.enableGrid) {
      xAxisDraw
        .select('.axis--xgrid')
        .attr('transform', `translate(0, ${y0})`)
        // @ts-ignore
        .call(this.scale.scaleX.grid.tickSize(-this.panelHeight));
    }
    if (this.configs.xScaleType === 'band') {
      xAxisDraw
        .select('clipPath')
        .select('rect')
        .attr('width', this.panelWidth)
        // @ts-ignore
        .attr('height', this.panelHeight + this.view.margin.top + this.view.margin.bottom)
        .attr('x', 0)
        .attr('y', 0);
    }

    const anchorX = this.configs.xAxis?.textAnchor;
    const x = anchorX === 'middle' ? this.panelWidth / 2 : anchorX === 'end' ? this.panelWidth : 0;
    const y = this.configs.xAxis?.axisLabelDistance;
    xAxisDraw
      .select('.xAxis--label')
      .attr('transform', `translate(0, ${y0}) rotate(${this.configs.xAxis?.rotate}, ${x}, ${y}) `)
      .style('text-anchor', anchorX!)
      .attr('x', x)
      .attr('dy', this.configs.xAxis?.axisLabelDistance!)
      .text(this.configs.xAxis?.axisLabel!);
  }

  updateYAxis(): void {
    const yAxisDraw = this.drawPanel.select('.yAxisDraw');
    const x0 = this.configs.yAxis?.position === 'left' ? 0 : this.panelWidth;
    yAxisDraw
      .select('.axis--y')
      .attr('transform', `translate(${x0}, 0)`)
      // @ts-ignore
      .call(this.scale.scaleY.axis.tickSize(this.configs.yAxis.tickSize).tickPadding(this.configs.yAxis?.tickPadding!));
    if (this.configs.xAxis?.enableGrid) {
      yAxisDraw
        .select('.axis--ygrid')
        .attr('transform', `translate(${x0}, 0)`)
        // @ts-ignore
        .call(this.scale.scaleY.grid.tickSize(-this.panelWidth));
    }
    if (this.configs.yScaleType === 'band') {
      yAxisDraw
        .select('clipPath')
        .select('rect')
        .attr('width', this.panelWidth + this.view.margin.left!)
        .attr('height', this.panelHeight)
        .attr('x', -this.view.margin.left!)
        .attr('y', 0);
    }

    const anchorY = this.configs.yAxis!.textAnchor;
    const y = anchorY === 'start' ? this.panelHeight : anchorY === 'middle' ? this.panelHeight / 2 : 0;
    yAxisDraw
      .select('.yAxis--label')
      .attr(
        'transform',
        `translate(${x0}, 0) rotate(${this.configs.yAxis!.rotate}, ${this.configs.yAxis!.axisLabelDistance}, ${y})`,
      )
      .style('text-anchor', anchorY!)
      .attr('y', anchorY === 'end' ? y + 15 : y) // TODO not sure for this 15 for font size
      .attr('dx', this.configs.yAxis!.axisLabelDistance!)
      .text(this.configs.yAxis!.axisLabel!);
  }

  private drawXAxis(): void {
    const xAxisDraw = this.drawPanel.select('.xAxisDraw');
    if (this.configs.xScaleType === 'band') {
      xAxisDraw.append('defs').append('clipPath').attr('id', `clip-axis--x${this.drawID}`).append('rect');
      xAxisDraw.attr('clip-path', `url(#clip-axis--x${this.drawID})`);
    }
    xAxisDraw.append('g').attr('class', 'axis axis--x');
    xAxisDraw.append('g').attr('class', 'axis axis--xgrid');
    xAxisDraw.append('g').append('text').attr('class', 'xAxis--label');
  }

  private drawYAxis(): void {
    const yAxisDraw = this.drawPanel.select('.yAxisDraw');
    if (this.configs.yScaleType === 'band') {
      yAxisDraw.append('defs').append('clipPath').attr('id', `clip-axis--y${this.drawID}`).append('rect');
      yAxisDraw.attr('clip-path', `url(#clip-axis--y${this.drawID})`);
    }
    yAxisDraw.append('g').attr('class', 'axis axis--y');
    yAxisDraw.append('g').attr('class', 'axis axis--ygrid');
    yAxisDraw.append('g').append('text').attr('class', 'yAxis--label');
  }
}
