import * as d3 from 'd3-selection';
import * as d3Dispatch from 'd3-dispatch';
import { GnroScaleDraw, GnroView } from '.';
import { GnroScale, GnroD3Options, GnroD3ChartConfig, GnroD3Interactive } from '../models';

export abstract class GnroAbstractDraw<T> {
  chartType: string;
  panelId: string; // TODO remove
  xAxisId: string;
  yAxisId: string;

  protected data!: any[];
  // protected options: GnroD3Options;
  protected prevData!: T[];
  protected isAnimation = false;
  protected isStacked = false;
  protected reverse = false;
  protected normalized = false;
  protected isGrouped = false;
  protected hoveredKey = '';
  protected hoveredIndex = -2;

  abstract drawContents(
    drawName: string,
    scaleX: GnroScale,
    scaleY: GnroScale,
    xGroup: GnroScale,
    yGroup: GnroScale,
  ): void;
  abstract redrawContent(
    drawName: string,
    scaleX: GnroScale,
    scaleY: GnroScale,
    xGroup: GnroScale,
    yGroup: GnroScale,
  ): void;
  abstract legendMouseover(e: any, data: T[], mouseover: boolean): void;

  get scaleX(): any {
    // TODO zoom for all other charts
    return this.scale.x.find((scale) => scale.panelId === this.panelId && scale.axisId === this.xAxisId);
  }

  get scaleY(): any {
    // TODO zoom for all other charts
    return this.scale.y.find((scale) => scale.panelId === this.panelId && scale.axisId === this.yAxisId);
  }

  get drawPanel(): d3.Selection<d3.BaseType, {}, HTMLElement, any> {
    return this.view.svg.select(`.panel${this.panelId}`);
  }

  get panelHeight(): number {
    return this.view.getPanelHeight(this.panelId);
  }

  get panelWidth(): number {
    return this.view.getPanelWidth(this.panelId);
  }

  constructor(
    protected view: GnroView,
    protected scale: GnroScaleDraw<T>,
    protected dispatch: d3Dispatch.Dispatch<{}>,
    protected chart: GnroD3ChartConfig,
  ) {
    // @ts-ignore
    this.chartType = this.chart.chartType;
    // @ts-ignore
    this.panelId = this.chart.panelId;
    // @ts-ignore
    this.xAxisId = this.chart.xAxisId;
    // @ts-ignore
    this.yAxisId = this.chart.yAxisId;
  }

  createDrawElement(name: string, cliped = false): void {
    this.drawPanel.select(`.${name}`).remove();
    const drawEl = this.drawPanel.select('.drawArea').append('g').attr('class', name);
    if (cliped) {
      const clipPath = this.drawPanel.select('.drawArea').select('clipPath');
      drawEl.attr('clip-path', `url(#${clipPath.property('id')})`);
    }
  }

  private getChartType(): string {
    return this.yAxisId === 'RIGHT' ? `${this.chartType}RIGHT` : this.chartType;
  }

  drawChart(data: any[]): void {
    this.prevData = this.data;
    this.data = data;

    this.isAnimation = true;
    // const scaleY = this.scaleY.value;
    this.drawContents(
      `.${this.getChartType()}`,
      this.scaleX.value,
      this.scaleY.value,
      this.scaleX.group,
      this.scaleY.group,
    );
    this.isAnimation = false;
    // @ts-ignore
    if (this.chart.zoom.horizontalBrushShow) {
      this.drawContents(
        `.${this.getChartType()}Brush`,
        this.scaleX.brushX,
        this.scaleY.brushX,
        this.scaleX.brushXGroup,
        this.scaleY.brushXGroup,
      );
    }
    // @ts-ignore
    if (this.chart.zoom.verticalBrushShow) {
      this.drawContents(
        `.${this.getChartType()}BrushY`,
        this.scaleX.brushY,
        this.scaleY.brushY,
        this.scaleX.brushYGroup,
        this.scaleY.brushYGroup,
      );
    }
  }

  redraw(): void {
    this.redrawContent(
      `.${this.getChartType()}`,
      this.scaleX.value,
      this.scaleY.value,
      this.scaleX.group,
      this.scaleY.group,
    );
  }

  // @ts-ignore
  getdrawColor = (d, i) => d.color || this.scale.colors$()(this.chart.drawColor(d, i));
  // @ts-ignore
  getBarColor = (d, i) => d.color || (this.chart.barColor && this.scale.colors$()(this.chart.barColor(d, i)));
  // @ts-ignore
  getStackeddrawColor = (d, i) => d.color || this.scale.colors$()(d.key); // key is from stacked data

  // below for popover data
  // @ts-ignore
  getInteractiveData(idx, data): GnroD3Interactive[] {
    if (this.hoveredIndex !== -2) {
      idx = this.hoveredIndex;
    }

    const chartType = data.chartType || this.chart.chartType;

    if (idx > -1 && chartType === this.chartType) {
      if (this.isGrouped) {
        return this.getDrawData(idx, data);
      } else if (this.chart.chartType === 'pieChart' || this.chart.chartType === 'radialGauge') {
        return this.getDrawData(idx, data);
      } else {
        // @ts-ignore
        const key = this.chart.x0(data);
        // @ts-ignore
        const ndata = this.data.filter((d: any) => key === this.chart.x0(d) || key === d.key);
        if (ndata.length > 0) {
          return this.isStacked ? this.getStackedData(idx, ndata[0]) : this.getDrawData(idx, ndata[0]);
        }
      }
    }
  }

  // @ts-ignore
  private getStackedData(idx: number, data): GnroD3Interactive[] {
    const d = data[idx];
    if (d && d.data) {
      const r: GnroD3Interactive = {
        key: data.key,
        value: d,
        color: this.getStackeddrawColor(data, idx),
        // @ts-ignore
        valueX: this.chart.x(d.data),
        valueY: `${d[1] - d[0]}`,
        cy: this.scaleY.value(d[1]),
        hovered: this.hoveredKey === data.key,
        hasSummary: !this.normalized,
        reverse: this.reverse,
        normalized: this.normalized,
      };
      this.setValueXY(r, idx);
      return [r];
    }
  }

  // @ts-ignore
  getDrawData(idx: number, data: T): GnroD3Interactive[] {
    // @ts-ignore
    const d = this.chart.y0(data).filter((t, i) => i === idx);
    if (d.length > 0) {
      const r: GnroD3Interactive = {
        // @ts-ignore
        key: this.chart.x0(data),
        value: d,
        color: d[0].color || this.getdrawColor(data, idx),
        // @ts-ignore
        valueX: this.chart.x(d[0]),
        // @ts-ignore
        valueY: this.chart.y(d[0]),
        // @ts-ignore
        cy: this.scaleY.value(this.chart.y(d[0])),
        // @ts-ignore
        hovered: this.hoveredKey === this.chart.x0(data),
        hasSummary: this.isGrouped,
      };
      this.setValueXY(r, idx);
      return [r];
    }
  }

  setValueXY(r: GnroD3Interactive, idx: number): void {}

  getHoveredIndex(e: any): { idx: number; jdx: number } {
    const group = this.drawPanel.select(`.${this.chartType}`).selectAll('g');
    const nodes = group.nodes();
    const node = d3.select(e.target).node();
    let i = -1;
    let j = -1;
    nodes.forEach((n, k) => {
      if (j === -1) {
        const pnodes = d3.select(n).selectAll('rect').nodes();
        j = pnodes.indexOf(node);
        if (j > -1) {
          i = k;
        }
      }
    });
    return { idx: i, jdx: j };
  }
}
