export interface GnroD3LegendOptions {
  // TODO if need more options ??
  enabled?: boolean;
  position?: 'top' | 'bottom' | 'right'; // align 'right' | 'left' for position 'top' | 'bottom'
  align?: 'right' | 'left' | 'top' | 'center'; // align 'top' | 'center' for position 'right'
}

export const DEFAULT_D3LEGEND_OPTIONS: GnroD3LegendOptions = {
  enabled: true,
  position: 'top',
  align: 'right',
};
