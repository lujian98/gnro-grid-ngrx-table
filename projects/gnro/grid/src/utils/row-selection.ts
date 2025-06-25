import { SelectionModel } from '@angular/cdk/collections';
import { GnroGridConfig, GnroGridRowSelections } from '../models/grid.model';
import { GnroRowGroup } from '../utils/row-group/row-group';

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

export function allRowSelected<T>(selection: SelectionModel<T>, data: T[]): boolean {
  const dataCounts = data.filter((item) => item && !(item instanceof GnroRowGroup)).length;
  return selection.selected.length === dataCounts && dataCounts > 0;
}

export function getSelection<T>(
  gridConfig: GnroGridConfig,
  selection: SelectionModel<T>,
  data: T[],
): GnroGridRowSelections<T> {
  const selected = getSelected(gridConfig, selection, data);
  const allSelected = allRowSelected(selection, data);
  return {
    selection: selection,
    selected,
    allSelected,
    indeterminate: !allSelected && selected > 0,
  };
}
