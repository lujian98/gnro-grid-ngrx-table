import * as d3Format from 'd3-format';

export interface GnroD3PopoverSerie {
  key: string;
  value: string;
  color?: string;
  hovered?: boolean;
}

export interface GnroD3Popover {
  key?: string;
  value?: string;
  series: GnroD3PopoverSerie[];
}

export interface GnroD3PopoverOptions {
  totalLable?: string;
  axisFormatter?: Function;
  serieFormatter?: Function;
  valueFormatter?: Function;
  normalizedFormatter?: Function;
}

export const DEFAULT_D3POPOVER_OPTIONS: GnroD3PopoverOptions = {
  totalLable: 'Total',
  axisFormatter: (d: any) => d,
  serieFormatter: (d: any) => d,
  valueFormatter: (d: any) => d3Format.format(',.2f')(d),
  normalizedFormatter: (d: any) => d3Format.format(',.2f')(d),
};
