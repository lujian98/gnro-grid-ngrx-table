import { SelectionModel } from '@angular/cdk/collections';
import { GnroGridConfig } from '../models/grid.model';

export function getSelected<T>(gridConfig: GnroGridConfig, selection: SelectionModel<T>, data: T[]): number {
  let selected = 0;
  if (selection.hasValue()) {
    const recordKey = gridConfig.recordKey;
    selection.selected.forEach((record) => {
      const find = data.find(
        (item) => (item as { [key: string]: unknown })[recordKey] === (record as { [key: string]: unknown })[recordKey],
      );
      selection.deselect(record);
      if (find) {
        selection.select(find);
        selected++;
      }
    });
  }
  return selected;
}
