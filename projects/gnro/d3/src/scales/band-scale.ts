import * as d3Scale from 'd3-scale';
import { GnroAbstractScale } from './abstract-scale';
import { GnroScaleBand } from '../models';

export class GnroBandScale<T> extends GnroAbstractScale<T> {
  getScale(range: number[], reverse = false): GnroScaleBand {
    if (reverse) {
      range.reverse();
    }
    return d3Scale.scaleBand().rangeRound(range).paddingInner(0.1);
  }

  updateRange(scale: GnroScaleBand, range: number[], reverse: boolean): void {
    if (reverse) {
      range.reverse();
    }
    scale.rangeRound(range);
  }

  // @ts-ignore
  setXDomain(scale: GnroScaleBand, data: T[], type: string = null): void {
    const xdomain = this.configs.y0!(data[0]).map((d: any) => this.configs.x!(d));
    scale.domain(xdomain);
  }

  // @ts-ignore
  setYDomain(scale: GnroScaleBand, data: T[], type: string = null): void {
    const ydomain = this.configs.y0!(data[0]).map((d: any) => this.configs.y!(d));
    scale.domain(ydomain);
  }
}
