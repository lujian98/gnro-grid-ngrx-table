import { GnroMenuConfig } from '@gnro/ui/menu';

export interface GnroAccordion {
  name: string;
  title?: string;
  items?: GnroMenuConfig[];
  expanded?: boolean;
}
