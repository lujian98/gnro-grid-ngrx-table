import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import { GnroAbstractScale } from './abstract-scale';
import { GnroScaleLinear } from '../models';

export class GnroLinearScale<T> extends GnroAbstractScale<T> {
  getScale(range: number[], reverse = false): GnroScaleLinear {
    return d3Scale.scaleLinear().range(range);
  }

  updateRange(scale: GnroScaleLinear, range: number[], reverse: boolean): void {
    scale.range(range);
  }

  // @ts-ignore
  setXDomain(scale: GnroScaleLinear, data: [], type: string = null): void {
    let minv;
    let maxv;
    if (type === 'stacked') {
      // @ts-ignore
      minv = d3Array.min(data, (c) => d3Array.min(c, (d) => d[0]));
      // @ts-ignore
      maxv = d3Array.max(data, (c) => d3Array.max(c, (d) => d[1]));
    } else if (type === 'normalized') {
      minv = 0;
      maxv = 1;
    } else {
      minv = d3Array.min(data, (c) => d3Array.min(this.configs.y0!(c), (d) => +this.configs.x!(d)));
      maxv = d3Array.max(data, (c) => d3Array.max(this.configs.y0!(c), (d) => +this.configs.x!(d)));
    }
    if (this.configs.chartType === 'horizontalBarChart' || this.configs.chartType === 'groupedHorizontalBarChart') {
      minv = minv > 0 ? 0 : minv;
      maxv = maxv < 0 ? 0 : maxv;
    }
    scale.domain([minv, maxv]).nice();
  }

  // @ts-ignore
  setYDomain(scale: GnroScaleLinear, data: [], type: string = null): void {
    let minv;
    let maxv;
    if (type === 'stacked') {
      // @ts-ignore
      minv = d3Array.min(data, (c) => d3Array.min(c, (d) => d[0]));
      // @ts-ignore
      maxv = d3Array.max(data, (c) => d3Array.max(c, (d) => d[1]));
    } else if (type === 'normalized') {
      // possible negative?
      minv = 0;
      maxv = 1;
    } else {
      minv = d3Array.min(data, (c) => d3Array.min(this.configs.y0!(c), (d) => +this.configs.y!(d)));
      maxv = d3Array.max(data, (c) => d3Array.max(this.configs.y0!(c), (d) => +this.configs.y!(d)));
    }
    if (this.configs.chartType === 'barChart' || this.configs.chartType === 'groupedBarChart') {
      minv = minv > 0 ? 0 : minv;
      maxv = maxv < 0 ? 0 : maxv;
    }
    scale.domain([minv, maxv]).nice();
  }
}
