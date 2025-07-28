import {
  DEFAULT_BULLET_CHART_CONFIGS,
  DEFAULT_CHART_CONFIGS,
  DEFAULT_PIE_CHART_CONFIGS,
  DEFAULT_RADIAL_GAUGE_CONFIGS,
  DEFAULT_VERTICAL_BULLET_CHART_CONFIGS,
  GnroD3ChartConfig,
} from '../models';

export function initChartConfigs(chartConfigs: GnroD3ChartConfig[]): GnroD3ChartConfig[] {
  const initConfigs = chartConfigs.map((item, index) => {
    let chart = { ...item };
    if (chart.panelId === undefined) {
      chart.panelId = '0';
    }
    if (chart.yAxisId === undefined) {
      chart.yAxisId = 'LEFT';
    }
    if (chart.xAxisId === undefined) {
      chart.xAxisId = 'BOTTOM';
    }
    if (index > 0) {
      chart = getOptions(chart, chartConfigs[0]);
    }
    let configs = DEFAULT_CHART_CONFIGS;
    if (chart.chartType === 'bulletChart') {
      const bulletType = chart.bullet && chart.bullet.type ? chart.bullet.type : 'horizontal';
      const dOptions = bulletType === 'vertical' ? DEFAULT_VERTICAL_BULLET_CHART_CONFIGS : DEFAULT_BULLET_CHART_CONFIGS;
      configs = getOptions(dOptions, configs);
    } else if (chart.chartType === 'pieChart') {
      configs = getOptions(DEFAULT_PIE_CHART_CONFIGS, configs);
    } else if (chart.chartType === 'radialGauge') {
      configs = getOptions(DEFAULT_RADIAL_GAUGE_CONFIGS, configs);
    }
    return getOptions(chart, configs); // TODO options is default chart config
  });
  return initConfigs;
}

function getOptions(option1: GnroD3ChartConfig, option2: GnroD3ChartConfig): GnroD3ChartConfig {
  for (const [key, value] of Object.entries(option1)) {
    // @ts-ignore
    if (typeof value === 'object' && value !== null && option2[key]) {
      // @ts-ignore
      option1[key] = { ...option2[key], ...option1[key] };
    }
  }
  return { ...option2, ...option1 };
}
