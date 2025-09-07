import { SelectionModel } from '@angular/cdk/collections';
import { GrnoDataType } from '@gnro/ui/core';
import { GnroGridConfig, GnroGridRowSelections } from '../models/grid.model';
import { GnroRowGroup } from '../utils/row-group/row-group';

export function setSelection<T>(gridConfig: GnroGridConfig, selection: SelectionModel<T>, data: T[]) {
  if (selection.hasValue()) {
    const recordKey = gridConfig.recordKey;
    selection.selected.forEach((record) => {
      const find = data.find((item) => (item as GrnoDataType)[recordKey] === (record as GrnoDataType)[recordKey]);
      selection.deselect(record);
      if (find) {
        selection.select(find);
      }
    });
  }
}

export function getSelection<T>(
  gridConfig: GnroGridConfig,
  selection: SelectionModel<T>,
  data: T[],
): GnroGridRowSelections<T> {
  const dataCounts = data.filter((item) => item && !(item instanceof GnroRowGroup)).length;
  const allSelected = selection.selected.length === dataCounts && dataCounts > 0;
  const selected = selection.selected.length;
  return {
    selection: selection,
    selected,
    allSelected,
    indeterminate: !allSelected && selected > 0,
  };
}
