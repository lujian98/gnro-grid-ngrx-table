import * as d3Shape from 'd3-shape';
import { GnroD3Options, GnroPosition, GnroD3ChartConfig, GnroD3PieChartOptions } from '../models';

export class GnroPieData {
  pieOptions!: GnroD3PieChartOptions;
  constructor(private chart: GnroD3ChartConfig) {}

  getPieData(data: any[], withRange: boolean = false): any[] {
    const pie = d3Shape
      .pie()
      .padAngle(this.pieOptions.padAngle!)
      .sort(null)
      .value((d: any) => (withRange ? d.maxv - d.minv : this.chart.y!(d)))
      .startAngle(this.pieOptions.startAngle!)
      .endAngle(this.pieOptions.endAngle!);
    const mdata = data.filter((d) => !d.disabled);
    return pie([...mdata]);
  }

  setPieScaleXY(): GnroPosition {
    const dAngle = Math.abs(this.pieOptions.endAngle! - this.pieOptions.startAngle!);
    const sxy: GnroPosition = { x: 0, y: 0 };
    if (dAngle <= Math.PI) {
      const sinStart = +Math.sin(this.pieOptions.startAngle!).toFixed(4);
      const sinEnd = +Math.sin(this.pieOptions.endAngle!).toFixed(4);
      const cosStart = +Math.cos(this.pieOptions.startAngle!).toFixed(4);
      const cosEnd = +Math.cos(this.pieOptions.endAngle!).toFixed(4);
      if (dAngle <= Math.PI / 2) {
        if (sinStart <= 0 && cosStart >= 0 && sinEnd <= 0 && cosEnd >= 0) {
          sxy.x = 1;
          sxy.y = 1;
        } else if (sinStart >= 0 && cosStart >= 0 && sinEnd >= 0 && cosEnd >= 0) {
          sxy.x = -1;
          sxy.y = 1;
        } else if (sinStart >= 0 && cosStart <= 0 && sinEnd >= 0 && cosEnd <= 0) {
          sxy.x = -1;
          sxy.y = -1;
        } else if (sinStart <= 0 && cosStart <= 0 && sinEnd <= 0 && cosEnd <= 0) {
          sxy.x = 1;
          sxy.y = -1;
        }
      } else {
        if (cosStart >= 0 && cosEnd >= 0 && sinEnd > sinStart) {
          sxy.y = 1 / 2;
        } else if (cosStart <= 0 && cosEnd <= 0 && sinEnd < sinStart) {
          sxy.y = -1 / 4;
        } else if (sinStart >= 0 && sinEnd >= 0 && cosEnd < cosStart) {
          sxy.x = -1 / 2;
        } else if (sinStart <= 0 && sinEnd <= 0 && cosEnd > cosStart) {
          sxy.x = 1 / 2;
        }
      }
    }
    return sxy;
  }
}
