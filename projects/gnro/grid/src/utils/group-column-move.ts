import { moveItemInArray } from '@angular/cdk/drag-drop';
import { GnroColumnConfig } from '../models/grid.model';

export function groupColumnMove(
  previousIndex: number,
  currentIndex: number,
  columns: GnroColumnConfig[],
): GnroColumnConfig[] {
  const moved = columns[previousIndex];
  const changed = columns[currentIndex];
  if (!moved.groupHeader && !changed.groupHeader) {
    moveItemInArray(columns, previousIndex, currentIndex);
  } else if (moved.groupHeader?.name === changed.groupHeader?.name) {
    moveItemInArray(columns, previousIndex, currentIndex);
  } else if (moved.groupHeader && !changed.groupHeader) {
    if (currentIndex < previousIndex) {
      const lastIndex = lastGroupIndex(moved.groupHeader?.name, columns);
      moveItemInArray(columns, currentIndex, lastIndex);
    } else {
      const firstIndex = firstGroupIndex(moved.groupHeader?.name, columns);
      moveItemInArray(columns, currentIndex, firstIndex);
    }
  } else if (!moved.groupHeader && changed.groupHeader) {
    if (currentIndex < previousIndex) {
      const firstIndex = firstGroupIndex(changed.groupHeader?.name, columns);
      moveItemInArray(columns, previousIndex, firstIndex);
    } else {
      const lastIndex = lastGroupIndex(changed.groupHeader?.name, columns);
      moveItemInArray(columns, previousIndex, lastIndex);
    }
  } else if (moved.groupHeader && changed.groupHeader) {
    if (currentIndex < previousIndex) {
      let newIndex = firstGroupIndex(changed.groupHeader?.name, columns);
      [...columns].forEach((col, index) => {
        if (col.groupHeader?.name === moved.groupHeader?.name) {
          moveItemInArray(columns, index, newIndex);
          newIndex++;
        }
      });
    } else if (currentIndex > previousIndex) {
      const moveGroup = [...columns].filter((col) => col.groupHeader?.name === moved.groupHeader?.name);
      const items = [...columns].filter((col) => col.groupHeader?.name !== moved.groupHeader?.name);
      const index = lastGroupIndex(changed.groupHeader?.name, items) + 1;
      console.log(' items =', items);
      console.log(' moveGroup =', moveGroup);
      console.log(' newIndex =', index);
      items.splice(index, 0, ...moveGroup);
      return items;
    }
  }
  return columns;
}

function firstGroupIndex(name: string, columns: GnroColumnConfig[]): number {
  return columns.findIndex((col) => col.groupHeader?.name === name);
}

function lastGroupIndex(name: string, columns: GnroColumnConfig[]): number {
  const index = [...columns]
    .slice()
    .reverse()
    .findIndex((col) => col.groupHeader?.name === name);
  return columns.length - 1 - index;
}
