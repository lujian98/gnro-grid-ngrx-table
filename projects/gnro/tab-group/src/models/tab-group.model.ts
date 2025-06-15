import { InjectionToken } from '@angular/core';

export interface GnroTabGroupConfig {
  animationDuration?: string;
  disablePagination?: boolean;
  fitInkBarToContent?: boolean;
  dynamicHeight?: boolean;
  contentTabIndex?: number;
  preserveContent?: boolean;
  stretchTabs?: boolean;
  alignTabs: 'start' | 'center' | 'end';
}

export const GNRO_TAB_GROUP_CONFIG = new InjectionToken<GnroTabGroupConfig>('GNRO_TAB_GROUP_CONFIG');
