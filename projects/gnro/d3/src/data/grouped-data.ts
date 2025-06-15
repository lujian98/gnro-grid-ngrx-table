import { GnroD3Options, GnroD3ChartConfig } from '../models';

export class GnroGroupedData<T> {
  constructor(private chart: GnroD3ChartConfig) {}

  getGroupedData(data: T[], isXGrouped: boolean): any[] {
    // @ts-ignore
    const options = isXGrouped ? { v: (d) => this.chart.x!(d) } : { v: (d) => this.chart.y!(d) };
    let tdata: any[] = [];
    data.forEach((d) => {
      let sk: string;
      let kv: string;
      // @ts-ignore
      for (const [k, v] of Object.entries(d)) {
        // @ts-ignore
        if (!Array.isArray(d[k])) {
          sk = k;
          // @ts-ignore
          kv = v;
        } else {
          // @ts-ignore
          tdata = d[k].map((r) => {
            const exist = tdata.filter((nd) => options.v(nd) === options.v(r));
            const o = exist.length === 0 ? {} : exist[0];
            if (exist.length === 0) {
              o[k] = [];
            }
            for (const [key, value] of Object.entries(r)) {
              if (options.v(r) === value) {
                o[key] = value;
              } else {
                const m = {};
                // @ts-ignore
                m[sk] = kv;
                // @ts-ignore
                m[key] = value;
                o[k].push(m);
              }
            }
            return o;
          });
        }
      }
    });
    return tdata;
  }
}
