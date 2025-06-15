import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { GnroAbstractScale } from './abstract-scale';
import { GnroScaleTime } from '../models';

export class GnroTimeScale<T> extends GnroAbstractScale<T> {
  getScale(range: number[], reverse = false): GnroScaleTime {
    return d3Scale.scaleTime().range(range);
  }

  updateRange(scale: GnroScaleTime, range: number[], reverse: boolean): void {
    scale.range(range);
  }

  // @ts-ignore
  setXDomain(scale: GnroScaleTime, data: T[], type: string = null): void {
    const xdata = data.map((v) => this.configs.y0!(v).map((d: any) => this.configs.x!(d)))[0];
    if (this.configs.chartType === 'barChart') {
      // TODO options with add extra range for bar chart
      const max = d3Array.max(xdata);
      const addMax = new Date(max!);
      const minD = d3Array.min(xdata);
      addMax.setDate(addMax.getDate() + 40);
      xdata.push(addMax);
      const addMin = new Date(minD!);
      addMin.setDate(addMin.getDate() - 10);
      xdata.push(addMin);
    }
    // @ts-ignore
    scale.domain(d3Array.extent(xdata, (d: Date) => d));
  }

  // @ts-ignore
  setYDomain(scale: GnroScaleTime, data: T[], type: string = null): void {
    // TODO
  }
}
