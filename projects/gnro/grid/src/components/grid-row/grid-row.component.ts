import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ROW_SELECTION_CELL_WIDTH } from '../../models/constants';
import { GnroColumnConfig, GnroColumnWidth, GnroGridConfig, GnroGridSetting } from '../../models/grid.model';
import { getColumnsWidth } from '../../utils/viewport-width-ratio';
import { GnroGridCellEditComponent } from '../grid-cell/grid-cell-edit/grid-cell-edit.component';
import { GnroGridCellViewComponent } from '../grid-cell/grid-cell-view/grid-cell-view.component';
import { GnroGridCellComponent } from '../grid-cell/grid-cell.component';
import { GnroRowSelectComponent } from '../row-select/row-select.component';

@Component({
  selector: 'gnro-grid-row',
  templateUrl: './grid-row.component.html',
  styleUrls: ['./grid-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroGridCellComponent, GnroGridCellViewComponent, GnroGridCellEditComponent, GnroRowSelectComponent],
  host: {
    '[class.selected]': 'selected()',
  },
})
export class GnroGridRowComponent<T> {
  columns = input.required<GnroColumnConfig[]>();
  gridSetting = input.required<GnroGridSetting>();
  gridConfig = input.required<GnroGridConfig>();
  rowIndex = input.required<number>();
  selected = input.required<boolean>();
  columnWidths = input.required<GnroColumnWidth[]>();
  record = input.required<T>();

  get selectColumnWidth(): string {
    return `${ROW_SELECTION_CELL_WIDTH}px`;
  }

  getColumnWidth(column: GnroColumnConfig): string {
    const width = this.columnWidths().find((col) => col.name === column.name)?.width;
    return width ? `${width}px` : '';
  }

  isCellEditable(column: GnroColumnConfig): boolean {
    return !!(this.gridSetting().gridEditable && column.cellEditable);
  }

  isLastSticky(index: number): boolean {
    if (this.gridConfig().columnSticky) {
      const totSticky = [...this.columns()].filter((col) => col.sticky).length;
      return index === totSticky - 1;
    } else {
      return false;
    }
  }

  isFirstStickyEnd(index: number): boolean {
    if (this.gridConfig().columnSticky) {
      return index === [...this.columns()].findIndex((col) => col.stickyEnd);
    } else {
      return false;
    }
  }

  getStickyLeft(column: GnroColumnConfig, index: number): string {
    if (this.gridConfig().columnSticky && column.sticky) {
      const columns = [...this.columnWidths()].filter((_, idx) => idx < index);
      const width = getColumnsWidth(columns, this.gridConfig().rowSelection);
      return `${width}px`;
    } else {
      return 'unset';
    }
  }

  getStickyRight(column: GnroColumnConfig, index: number): string {
    if (this.gridConfig().columnSticky && column.stickyEnd) {
      const columns = [...this.columnWidths()].filter((_, idx) => idx > index);
      const width = getColumnsWidth(columns, false);
      return `${width}px`;
    } else {
      return 'unset';
    }
  }
}
