import { GnroAbstractScale } from './abstract-scale';
import { GnroLinearScale } from './linear-scale';
import { GnroTimeScale } from './time-scale';
import { GnroBandScale } from './band-scale';
import { GnroScale, GnroD3ChartConfig } from '../models';

export class GnroScaleFactory<T> {
  componentMapper = {
    linear: GnroLinearScale,
    time: GnroTimeScale,
    band: GnroBandScale,
  };

  componentRef!: GnroAbstractScale<T>;

  constructor(
    private scaleType: string,
    private configs: GnroD3ChartConfig,
  ) {
    this.setComponentRef();
  }

  setComponentRef(): void {
    // @ts-ignore
    let component = this.componentMapper[this.scaleType];
    if (!component) {
      component = this.componentMapper.linear;
    }
    this.componentRef = new component(this.configs);
  }

  getScale(range: number[], reverse = false): GnroScale {
    return this.componentRef.getScale(range, reverse);
  }

  updateRange(scale: GnroScale, range: number[], reverse = false): void {
    this.componentRef.updateRange(scale, range, reverse);
  }

  // @ts-ignore
  setXDomain(scale: GnroScale, data: T[], type: string = null): void {
    this.componentRef.setXDomain(scale, data, type);
  }

  // @ts-ignore
  setYDomain(scale: GnroScale, data: T[], type: string = null): void {
    this.componentRef.setYDomain(scale, data, type);
  }
}
