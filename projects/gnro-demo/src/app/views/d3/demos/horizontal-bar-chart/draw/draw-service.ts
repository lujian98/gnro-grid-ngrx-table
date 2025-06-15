import { Injectable } from '@angular/core';
import { GnroDrawServie } from '@gnro/ui/d3';
import { AppHorizontalBarChart } from './horizontal-bar-chart';

@Injectable()
export class AppDrawServie<T> extends GnroDrawServie<T> {
  constructor() {
    super();
    Object.assign(this.componentMapper, {
      horizontalBarChart: AppHorizontalBarChart,
    });
  }
}
