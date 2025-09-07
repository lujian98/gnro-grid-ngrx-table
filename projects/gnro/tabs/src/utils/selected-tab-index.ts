import { GnroTabConfig } from '../models/tabs.model';

export function getSelectedTabIndex<T>(tabs: GnroTabConfig<T>[], prevActive: GnroTabConfig<T>): number {
  const findPrevActive = tabs.findIndex((item) => item.name === prevActive.name);
  if (tabs.length === 0 || findPrevActive === -1) {
    return 0;
  }
  return findPrevActive;
}
