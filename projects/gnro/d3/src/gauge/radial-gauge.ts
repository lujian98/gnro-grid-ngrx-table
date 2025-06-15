import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';
import { GnroAbstractDraw } from '../draws/abstract-draw';
import { GnroPieData } from '../data/pie-data';
import { GnroScale, GnroScaleLinear, GnroD3Interactive, GnroPosition } from '../models';

export class GnroRadialGauge<T> extends GnroAbstractDraw<T> {
  private values!: T[];
  private lowerLimit!: number;
  private upperLimit!: number;
  private sxy!: GnroPosition;
  private cxy: GnroPosition = { x: -1, y: -1 };
  private outterRadius = 0;
  private innerRadius!: number;
  private majorGraduationLenght!: number;
  private minorGraduationLenght!: number;
  private majorGraduationMarginTop!: number;
  private startColor!: string;
  private colors: any;

  // @ts-ignore
  getDrawData(idx: number, data: T): GnroD3Interactive[] {
    // @ts-ignore
    return this.data.map((d: any, i) => {
      return {
        key: '',
        value: d,
        color: d.data.color || this.getdrawColor(d.data, i),
        valueX: null,
        valueY: `${d.data.minv} - ${d.data.maxv}`,
        cy: null,
        hovered: i === idx,
        hasSummary: false,
      };
    });
  }

  // @ts-ignore
  drawChart(data: T[]): void {
    if (this.chart.radialGauge!.range!.length > 0) {
      this.setRangeScale();
      const pie = new GnroPieData(this.chart);
      // @ts-ignore
      pie.pieOptions = this.chart.radialGauge;
      this.sxy = pie.setPieScaleXY();
      this.values = this.chart.y0!(data[0]) || [];
      // console.log('this.values =', this.values)
      if (this.isDataChangeOnly()) {
        this.inintCenterNeedle();
        this.drawCenterNeedle();
      } else {
        const piedata = pie.getPieData(this.getPieRangeData(), true);
        this.setColorScale(piedata);
        this.initDraw();
        super.drawChart(piedata);
      }
    }
  }

  private getPieRangeData(): any[] {
    const range = this.chart.radialGauge!.range;
    return range!
      .filter((d, i) => i > 0)
      .map((d, i) => {
        if (i === 0) {
          this.startColor = range![0].color || 'green';
        }
        return {
          minv: range![i].value,
          maxv: d.value,
          color: d.color,
        };
      });
  }

  private isDataChangeOnly(): boolean {
    const outterRadius = Math.round(
      Math.min((Math.abs(this.sxy.x) + 1) * this.panelWidth, (Math.abs(this.sxy.y) + 1) * this.panelHeight) / 2,
    );
    this.innerRadius = Math.round(outterRadius * this.chart.radialGauge!.donut!);
    const cxy = {
      x: ((this.sxy.x + 1) * this.panelWidth) / 2 + outterRadius * this.chart.radialGauge!.centerOffsetX!,
      y: ((this.sxy.y + 1) * this.panelHeight) / 2 + outterRadius * this.chart.radialGauge!.centerOffsetY!,
    };
    if (this.outterRadius === outterRadius && cxy.x === this.cxy.x && cxy.y === this.cxy.y) {
      return true;
    } else {
      this.outterRadius = outterRadius;
      this.cxy = cxy;
    }
    return false;
  }

  private setRangeScale(): void {
    // @ts-ignore
    this.lowerLimit = d3Array.min(this.chart.radialGauge!.range!, (d) => d.value);
    // @ts-ignore
    this.upperLimit = d3Array.max(this.chart.radialGauge!.range!, (d) => d.value);
    this.scaleY.value.range([this.chart.radialGauge!.startAngle, this.chart.radialGauge!.endAngle]);
    this.scaleY.value.domain([this.lowerLimit, this.upperLimit]);
    this.scale.setColorDomain(this.chart.radialGauge!.range!);
  }

  private setColorScale(data: T[]): void {
    const range: any[] = [];
    const domain: any[] = [];
    data.forEach((d: any, i) => {
      if (domain.length === 0) {
        domain.push(d.startAngle);
        range.push(this.startColor);
      }
      domain.push(d.endAngle);
      range.push(this.getdrawColor(d.data, i));
    });
    if (this.chart.radialGauge!.colorScale) {
      this.colors = this.chart.radialGauge!.colorScale.domain(domain);
    } else {
      const y: any = d3Interpolate.interpolateRgb;
      this.colors = d3Scale.scaleLinear().range(range).interpolate(y).domain(domain);
    }
  }

  private initDraw(): void {
    this.createDrawElement('gradients');
    this.majorGraduationLenght = Math.round(this.outterRadius * this.chart.radialGauge!.majorGraduationLenght!);
    this.minorGraduationLenght = Math.round(this.outterRadius * this.chart.radialGauge!.minorGraduationLenght!);
    this.majorGraduationMarginTop = Math.round(this.outterRadius * this.chart.radialGauge!.majorGraduationMarginTop!);
    this.createDrawElement('radialGaugeLabel');
    this.createDrawElement('majorGraduations');
    this.createDrawElement('minorGraduations');
    this.inintCenterNeedle();
  }

  private inintCenterNeedle(): void {
    this.createDrawElement('graduationNeedle');
    this.createDrawElement('graduationValueText');
    this.createDrawElement('graduationNeedleCenter');
  }

  private drawCenterNeedle(): void {
    this.drawPanel.select('.graduationNeedle').selectAll('g').data(this.values).join('g').append('path');
    this.drawPanel
      .select('.graduationValueText')
      .selectAll('g')
      .data(this.values.length > 0 ? this.values : [null])
      .join('g')
      .append('text');
    this.drawPanel.select('.graduationNeedleCenter').selectAll('g').data(this.values).join('g').append('circle');
    this.drawGraduationNeedles();
    this.drawGraduationValueText();
    this.drawNeedleCenters();
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
    if (drawName === `.${this.chartType}`) {
      const configs = this.chart.radialGauge;
      const majorAngles = this.getMajorValues(configs!.startAngle, configs!.endAngle, configs!.majorGraduations!);
      const minorAngles = this.getMinorAngles(majorAngles);
      this.drawPanel
        .select('.majorGraduations')
        .selectAll('line')
        .data(majorAngles)
        .join('line')
        .attr('class', 'drawMajorGraduations');
      this.drawPanel
        .select('.minorGraduations')
        .selectAll('line')
        .data(minorAngles)
        .join('line')
        .attr('class', 'drawMinorGraduations');
      this.drawPanel
        .select(`${drawName}Label`)
        .selectAll('g')
        .data(majorAngles)
        .join('g')
        .append('text')
        .attr('class', 'drawlabel');
      this.drawCenterNeedle();
    }
    this.redrawContent(drawName, scaleX, scaleY);
  }

  redrawContent(drawName: string, scaleX: GnroScale, scaleY: GnroScaleLinear): void {
    const drawContents = this.drawPanel
      .select(drawName)
      .selectAll('g')
      .select('.draw')
      .attr('transform', () => `translate(${this.cxy.x}, ${this.cxy.y})`)
      // @ts-ignore
      .attr('d', this.drawArc())
      .attr('fill', (d: any, i) =>
        this.chart.radialGauge!.enableGradients ? this.setGradients(d) : this.getdrawColor(d.data, i),
      );
    if (drawName === `.${this.chartType}`) {
      drawContents
        .on('mouseover', (e, d) => this.drawMouseover(e, d, true))
        .on('mouseout', (e, d) => this.drawMouseover(e, d, false));
      this.drawGraduations('.drawMajorGraduations', this.majorGraduationLenght);
      this.drawGraduations('.drawMinorGraduations', this.minorGraduationLenght);
      this.drawMajorGraduationTexts(drawName);
    }
  }

  private drawGraduationNeedles(): void {
    this.drawPanel
      .select('.graduationNeedle')
      .selectAll('g')
      .select('path')
      // @ts-ignore
      .attr('d', (d: number) => this.getTriangle(this.chart.y(d)))
      .style('stroke-width', 1)
      // @ts-ignore
      .style('stroke', (d: number) => this.getNeddleColor(d))
      // @ts-ignore
      .style('fill', (d: number) => this.getNeddleColor(d));
  }

  private getNeddleColor(d: number): string {
    d = d !== null ? this.chart.y!(d) : null;
    const scale = this.scaleY.value as GnroScaleLinear;
    const value = !isNaN(d) && d !== null ? scale(d) : null;
    return this.getValueColor(value!);
  }

  private getTriangle(d: number): string {
    const scale = this.scaleY.value as GnroScaleLinear;
    const thetaRad = scale(d) + Math.PI / 2;
    const needleLen = this.innerRadius - this.majorGraduationLenght - this.majorGraduationMarginTop;
    const needleRadius = this.outterRadius * this.chart.radialGauge!.needleEndRadius!;
    const topX = this.cxy.x - needleLen * Math.cos(thetaRad);
    const topY = this.cxy.y - needleLen * Math.sin(thetaRad);
    const leftX = this.cxy.x - needleRadius * Math.cos(thetaRad - Math.PI / 2);
    const leftY = this.cxy.y - needleRadius * Math.sin(thetaRad - Math.PI / 2);
    const rightX = this.cxy.x - needleRadius * Math.cos(thetaRad + Math.PI / 2);
    const rightY = this.cxy.y - needleRadius * Math.sin(thetaRad + Math.PI / 2);
    const triangle = `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
    return triangle;
  }

  private drawNeedleCenters(): void {
    this.drawPanel
      .select('.graduationNeedleCenter')
      .selectAll('g')
      .select('circle')
      .attr('r', this.outterRadius * this.chart.radialGauge!.needleCenterRadius!)
      .attr('cx', this.cxy.x)
      .attr('cy', this.cxy.y)
      // @ts-ignore
      .attr('fill', (d: number) => this.getNeddleColor(d));
  }

  private drawGraduationValueText(): void {
    const textSize = this.outterRadius * this.chart.radialGauge!.valueTextSize!;
    const y = this.cxy.y + Math.round(this.outterRadius * this.chart.radialGauge!.valueOffsetY!);
    this.drawPanel
      .select('.graduationValueText')
      .selectAll('g')
      .select('text')
      // @ts-ignore
      .attr('fill', (d: number) => this.getNeddleColor(d))
      .attr('x', this.cxy.x)
      .attr('y', (d, i) => y + i * (textSize + 2))
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .style('font', `${textSize}px Courier`)
      // @ts-ignore
      .text((d: number) => this.getValueText(d));
  }

  private getValueText(d: number): string {
    const label = d !== null && this.chart.x!(d) ? `${this.chart.x!(d)} ` : '';
    const y = d !== null ? this.chart.y!(d) : null;
    const text = y || y === 0 ? y.toFixed(this.chart.radialGauge!.valueDecimals) : '';
    return `[ ${label}${text} ${this.chart.radialGauge!.valueUnit} ]`;
  }

  private drawMajorGraduationTexts(drawName: string): void {
    const majorValues = this.getMajorValues(
      this.lowerLimit,
      this.upperLimit,
      this.chart.radialGauge!.majorGraduations!,
    );
    const textSize = this.outterRadius * this.chart.radialGauge!.majorGraduationTextSize!;
    const range = this.chart.radialGauge!.endAngle! - this.chart.radialGauge!.startAngle!;
    this.drawPanel
      .select(`${drawName}Label`)
      .selectAll('g')
      .select('.drawlabel')
      .style('font', `${textSize}px Courier`)
      // @ts-ignore
      .attr('text-anchor', (d: number) => {
        const sind = Math.sin(d);
        if (Math.abs(sind) < 0.001) {
          return 'middle';
        } else {
          return sind < 0 ? 'start' : 'end';
        }
      })
      // @ts-ignore
      .attr('x', (d: number, i) => this.getTextPositionX(d, i))
      // @ts-ignore
      .attr('dy', (d: number, i) => this.getTextPositionDy(d, i))
      // @ts-ignore
      .attr('fill', (d: number) => this.getValueColor(d))
      .style('fill-opacity', (d, i) => (i === 0 && range === 2 * Math.PI ? 0 : 1))
      .text(
        (d, i) => `${majorValues[i].toFixed(this.chart.radialGauge!.majorGraduationDecimals)}
        ${this.chart.radialGauge!.valueUnit}`,
      );
  }

  private getMajorValues(lowerLimit: any, upperLimit: any, graduations: number, j = 0): number[] {
    const scaleRange = upperLimit - lowerLimit;
    const majorValues = [];
    for (let i = j; i <= graduations - j; i++) {
      majorValues.push(lowerLimit + (i * scaleRange) / graduations);
    }
    return majorValues;
  }

  private getMinorAngles(majorAngles: number[]): number[] {
    let minorAngles: any[] = [];
    for (let i = 1; i <= this.chart.radialGauge!.majorGraduations!; i++) {
      const angles = this.getMajorValues(
        majorAngles[i - 1],
        majorAngles[i],
        this.chart.radialGauge!.minorGraduations!,
        1,
      );
      minorAngles = [...minorAngles, ...angles];
    }
    return minorAngles;
  }

  private getValueColor(value: number): any {
    if (value === null || value < this.chart.radialGauge!.startAngle! || value > this.chart.radialGauge!.endAngle!) {
      return this.chart.radialGauge!.valueNullColor;
    }
    if (this.chart.radialGauge!.enableGradients) {
      return this.colors(value);
    }
    const data: any = this.data.filter(
      (d: any, i) => value < d.endAngle || (i === this.data.length - 1 && value === this.chart.radialGauge!.endAngle),
    );
    if (data.length > 0) {
      return this.getdrawColor(data[0].data, data[0].index);
    }
    return '';
  }

  private getTextPositionX(d: number, i: number): number {
    const dt = this.innerRadius - this.majorGraduationMarginTop - this.majorGraduationLenght;
    const cos1Adj = Math.round(Math.cos(Math.PI / 2 - d) * (dt - this.chart.radialGauge!.textHorizontalPadding!));
    return this.cxy.x + cos1Adj;
  }

  private getTextPositionDy(d: number, i: number): number {
    const dt = this.innerRadius - this.majorGraduationMarginTop - this.majorGraduationLenght;
    const sin1Adj = Math.round(Math.sin(Math.PI / 2 - d) * (dt - this.chart.radialGauge!.textVerticalPadding!));
    let sin1Factor = -1;
    if (Math.abs(Math.cos(d) + 1) > 0.001) {
      sin1Factor = sin1Adj < 0 ? -1.1 : -0.9;
    }
    return this.cxy.y + sin1Adj * sin1Factor;
  }

  private drawGraduations(drawName: string, graduationLenght: number): void {
    const dt = this.innerRadius - this.majorGraduationMarginTop;
    const range = this.chart.radialGauge!.endAngle! - this.chart.radialGauge!.startAngle!;
    this.drawPanel
      .selectAll(drawName)
      // @ts-ignore
      .style('stroke', (d: number) => this.getValueColor(d))
      .style('stroke-opacity', (d, i) =>
        i === 0 && range === 2 * Math.PI && drawName === '.drawMajorGraduations' ? 0 : 1,
      )
      // @ts-ignore
      .attr('x1', (d: number) => this.cxy.x + Math.round(Math.cos(Math.PI / 2 - d) * (dt - graduationLenght)))
      // @ts-ignore
      .attr('y1', (d: number) => this.cxy.y - Math.round(Math.sin(Math.PI / 2 - d) * (dt - graduationLenght)))
      // @ts-ignore
      .attr('x2', (d: number) => this.cxy.x + Math.round(Math.cos(Math.PI / 2 - d) * dt))
      // @ts-ignore
      .attr('y2', (d: number) => this.cxy.y - Math.round(Math.sin(Math.PI / 2 - d) * dt));
  }

  private setGradients(data: any): string {
    const arcs = [];
    const dAngle = data.endAngle - data.startAngle;
    const noOfArcs = dAngle * 75; // seems like a good number
    const angle = dAngle / noOfArcs;
    for (let j = 0; j < noOfArcs; j++) {
      const arc: any = {};
      arc.startAngle = data.startAngle + angle * j;
      arc.endAngle = arc.startAngle + angle + 0.01; // 0.01 so the colours overlap slightly, so there's no funny artefacts.
      arc.endAngle = arc.endAngle > data.endAngle ? data.endAngle : arc.endAngle;
      arcs.push(arc);
    }
    this.drawPanel
      .select('.gradients')
      .attr('transform', () => `translate(${this.cxy.x}, ${this.cxy.y})`)
      .selectAll()
      .data(arcs)
      .enter()
      .append('g')
      .append('path')
      .attr('class', 'gradient-arc')
      .attr('d', this.drawArc())
      .style('fill', (d) => this.colors((d.startAngle + d.endAngle) / 2));
    return 'none';
  }

  drawArc(grow: number = 0): d3Shape.Arc<any, d3Shape.DefaultArcObject> {
    return d3Shape
      .arc()
      .innerRadius(this.innerRadius)
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

  legendMouseover(): void {}
}
