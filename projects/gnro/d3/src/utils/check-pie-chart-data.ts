import { GnroD3ChartConfig } from '../models';

export function checkPieChartData<T>(data: T[], chartConfigs: GnroD3ChartConfig[]): any[] {
  const configs = chartConfigs[0];
  // data = cloneData(data);
  return data && configs.chartType === 'pieChart' && !configs.y0!(data[0])
    ? [{ key: 'Pie Chart', values: data }]
    : data;
}

function cloneData<T>(data: T[]) {
  return data && data.map((d) => (typeof d === 'object' ? Object.assign({}, d) : d));
}
