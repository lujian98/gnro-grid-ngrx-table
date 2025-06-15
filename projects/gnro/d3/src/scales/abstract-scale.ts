import { GnroScale, GnroD3ChartConfig } from '../models';

export abstract class GnroAbstractScale<T> {
  abstract getScale(range: number[], reverse: boolean): GnroScale;
  abstract updateRange(scale: GnroScale, range: number[], reverse: boolean): void;
  abstract setXDomain(scale: GnroScale, data: T[], type: string): void;
  abstract setYDomain(scale: GnroScale, data: T[], type: string): void;

  constructor(protected configs: GnroD3ChartConfig) {}
}
