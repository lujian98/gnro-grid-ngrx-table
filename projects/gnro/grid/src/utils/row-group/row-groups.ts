import { GnroRowGroup } from './row-group';
import { GnroRowGroupField } from '../../models/grid.model';

export class GnroRowGroups {
  private _rowGroupFields: GnroRowGroupField[] = []; // only support one level more than two use tree grid
  private _rowGroups: GnroRowGroup[] = [];

  set rowGroups(groups: GnroRowGroup[]) {
    this._rowGroups = groups;
  }
  get rowGroups(): GnroRowGroup[] {
    return this._rowGroups;
  }

  set rowGroupFields(val: GnroRowGroupField[]) {
    this._rowGroupFields = val;
  }
  get rowGroupFields(): GnroRowGroupField[] {
    return this._rowGroupFields;
  }

  get totalHiddenCounts(): number {
    return this.rowGroups
      .filter((group: GnroRowGroup) => !group.expanded)
      .reduce((sum, group) => sum + group.totalCounts, 0);
  }

  getRowGroups<T>(data: T[]): T[] {
    data = [...data].filter((record) => !(record instanceof GnroRowGroup));
    this.setRowGroups(data, this.rowGroupFields);
    return this.getSublevel(data, 0, this.rowGroupFields);
  }

  private setRowGroups<T>(data: T[], rowGroupFields: GnroRowGroupField[]) {
    const groups = this.uniqueBy(
      data.map((row: T) => {
        const column = rowGroupFields[0];
        const value = (row as { [index: string]: string })[column.field];
        const find = this.rowGroups.find((item) => item.field === column.field && item.value === value);
        const group = new GnroRowGroup();
        group.field = column.field;
        group.value = value;
        group.expanded = find ? find.expanded : true;
        return group;
      }),
      JSON.stringify,
    );
    this.rowGroups = groups;
  }

  private getSublevel<T>(data: T[], level: number, rowGroupFields: GnroRowGroupField[]): T[] {
    if (level >= rowGroupFields.length) {
      return data as [];
    }
    const currentColumn = rowGroupFields[level].field;
    let subGroups: T[] = [];
    this.rowGroups.forEach((group: GnroRowGroup) => {
      const rowsInGroup = this.uniqueBy(
        data.filter(
          (row: T) =>
            !(row instanceof GnroRowGroup) && group.value === (row as { [index: string]: string })[currentColumn],
        ),
        JSON.stringify,
      );
      group.totalCounts = rowsInGroup.length;
      const rowsInGroupVisible = group.expanded ? rowsInGroup : [];
      const subGroup = this.getSublevel(rowsInGroupVisible, level + 1, rowGroupFields);
      subGroups = subGroups.concat(group as T);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy<T>(a: T[], key: Function) {
    const seen: { [index: string]: boolean } = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }
}
