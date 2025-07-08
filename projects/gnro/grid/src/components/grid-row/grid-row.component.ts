import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { GnroColumnConfig, GnroColumnWidth, GnroGridConfig, GnroGridSetting } from '../../models/grid.model';
import { getTableWidth } from '../../utils/viewport-width-ratio';
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
    '[style.width]': 'width$()',
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

  width$ = computed(() => {
    const tableWidth = this.gridConfig().horizontalScroll
      ? getTableWidth(this.columns(), this.gridConfig())
      : this.gridSetting().viewportWidth;
    return `${tableWidth}px`;
  });

  isCellEditable(column: GnroColumnConfig): boolean {
    return !!(this.gridSetting().gridEditable && column.cellEditable);
  }
}
