import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ROW_SELECTION_CELL_WIDTH } from '../../models/constants';
import { GnroColumnConfig, GnroColumnWidth, GnroGridConfig, GnroGridSetting } from '../../models/grid-column.model';
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
}
