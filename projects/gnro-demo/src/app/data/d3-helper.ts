import { GnroD3Options, GnroD3ChartConfigsResponse, GnroD3ConfigResponse } from '@gnro/ui/d3';

const options1: GnroD3Options = {
  margin: { top: 50, right: 80, bottom: 10, left: 10 },
};

export const RemoteD3ConfigP1: GnroD3ConfigResponse = {
  d3Config: {
    options: options1,
  },
};

const options2: GnroD3Options = {
  margin: { left: 80 },
};
export const RemoteD3ConfigP2: GnroD3ConfigResponse = {
  d3Config: {
    options: options2,
  },
};

export const RemoteD3ConfigP3: GnroD3ConfigResponse = {
  d3Config: {
    options: undefined,
  },
};

export const RemoteD3ConfigP4: GnroD3ConfigResponse = {
  d3Config: {
    options: undefined,
  },
};

export const RemoteChartConfigsP1: GnroD3ChartConfigsResponse = {
  d3ChartConfigs: [
    {
      chartType: 'lineChart',
      xScaleType: 'linear',
      useInteractiveGuideline: true,
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      drawColor: (d: any, i: number) => d.key,
      xAxis: {
        position: 'top',
        axisLabelDistance: -30,
        axisLabel: 'Time (ms)',
        // rotate: -90
      },
      yAxis: {
        position: 'right',
        axisLabelDistance: 50,
        axisLabel: 'Voltage (v)',
        rotate: -90,
      },
      zoom: {
        enabled: true,
        horizontalOff: false,
        horizontalBrushShow: false,
        verticalOff: false,
        verticalBrushShow: false,
      },
    },
    {
      chartType: 'areaChart',
    },
  ],
};

export const RemoteChartConfigsP2: GnroD3ChartConfigsResponse = {
  d3ChartConfigs: [
    {
      chartType: 'lineChart',
      xScaleType: 'linear',
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      drawColor: (d: any, i: number) => d.key,

      xAxis: {
        axisLabel: 'Time (ms)',
        textAnchor: 'start',
      },
      yAxis: {
        axisLabel: 'Voltage (v)',
        textAnchor: 'start',
      },
      zoom: {
        enabled: true,
        horizontalOff: false,
        horizontalBrushShow: true,
        verticalOff: true,
        verticalBrushShow: false,
      },
    },
    {
      chartType: 'areaChart',
    },
  ],
};

export const RemoteChartConfigsP3: GnroD3ChartConfigsResponse = {
  d3ChartConfigs: [
    {
      chartType: 'lineChart',
      xScaleType: 'linear',
      useInteractiveGuideline: true,
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      drawColor: (d: any, i: number) => d.key,
      xAxis: {
        axisLabel: 'Time (ms)',
        textAnchor: 'end',
      },
      yAxis: {
        axisLabel: 'Voltage (v)',
        textAnchor: 'end',
        rotate: -90,
        axisLabelDistance: -40,
      },
      zoom: {
        enabled: true,
        horizontalOff: true,
        horizontalBrushShow: false,
        verticalOff: false,
        verticalBrushShow: true,
      },
    },
    {
      chartType: 'areaChart',
    },
  ],
};

export const RemoteChartConfigsP4: GnroD3ChartConfigsResponse = {
  d3ChartConfigs: [
    {
      chartType: 'lineChart',
      xScaleType: 'linear',
      useInteractiveGuideline: true,
      x0: (d: any) => d.key,
      y0: (d: any) => d.values,
      drawColor: (d: any, i: number) => d.key,
      xAxis: {
        axisLabel: 'Time (ms)',
      },
      yAxis: {
        axisLabel: 'Voltage (v)',
      },
      zoom: {
        enabled: true,
        horizontalOff: false,
        horizontalBrushShow: true,
        verticalOff: false,
        verticalBrushShow: true,
      },
    },
    {
      chartType: 'areaChart',
    },
  ],
};

export const RemoteD3Data = getData();

function getData(): any[] {
  const sin = [];
  const sin2 = [];
  const cos = [];
  for (let i = 0; i < 100; i++) {
    sin.push({ x: i, y: Math.sin(i / 10) });
    sin2.push({ x: i, y: i % 10 === 5 ? null : Math.sin(i / 10) * 0.25 + 0.5 });
    cos.push({ x: i, y: 0.5 * Math.cos(i / 10 + 2) + Math.random() / 10 });
  }
  return [
    {
      values: sin, // values - represents the array of {x,y} data points
      key: 'Sine Wave', // key  - the name of the series.
      color: '#ff7f0e', // color - optional: choose your own line color.
    },
    {
      values: sin2,
      key: 'Another sine wave',
      color: '#7777ff',
      chartType: 'areaChart', // area - set to true if you want this line to turn into a filled area chart.
    },
    {
      values: cos,
      key: 'Cosine Wave',
      color: '#2ca02c',
    },
  ];
}
