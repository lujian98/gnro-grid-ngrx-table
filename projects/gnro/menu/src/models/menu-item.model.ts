import { IsActiveMatchOptions, Params } from '@angular/router';
import { GnroIconConfig } from '@gnro/ui/icon';

export interface GnroMenuConfig {
  name: string;
  title?: string;
  selected?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  icon?: string | GnroIconConfig;
  link?: string;
  queryParams?: Params;
  routerOptions?: { exact: boolean } | IsActiveMatchOptions;
  checkbox?: boolean;
  checked?: boolean;
  separator?: boolean; // TODO need menu-item-separator class

  keepOpen?: boolean; // for cdk-menus not fully working
  children?: GnroMenuConfig[];
}
