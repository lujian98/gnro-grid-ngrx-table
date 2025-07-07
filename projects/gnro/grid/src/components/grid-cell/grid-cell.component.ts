import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { GnroColumnConfig, GnroColumnWidth, GnroGridConfig, GnroGridSetting } from '../../models/grid.model';
import { ROW_SELECTION_CELL_WIDTH } from '../../models/constants';
import { getColumnsWidth } from '../../utils/viewport-width-ratio';

@Component({
  selector: 'gnro-grid-cell',
  template: '<ng-content></ng-content>',
  styleUrls: ['./grid-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sticky]': 'sticky()',
    '[class.row-even-sticky]': 'sticky() && rowIndex() % 2 === 1',
    '[class.row-odd-sticky]': 'sticky() && rowIndex() % 2 === 0',
    '[class.selected]': 'sticky() && selected()',

    '[style.height]': 'height$()',
    '[style.flex]': 'flex$()',
    '[style.left]': 'left$()',
  },
})
//
export class GnroGridCellComponent {
  gridConfig = input.required<GnroGridConfig>();
  selected = input.required<boolean>();
  rowIndex = input.required<number>();
  column = input.required<GnroColumnConfig | string>();
  columns = input.required<GnroColumnConfig[]>();
  columnWidths = input.required<GnroColumnWidth[]>();

  height$ = computed(() => `${this.gridConfig().rowHeight}px`);

  isSelectionColumn = computed(() => typeof this.column() === 'string' && this.column() === 'selection');

  sticky = computed(() => {
    if (this.gridConfig().columnSticky) {
      if (this.isSelectionColumn()) {
        return true;
      } else {
        const column = this.column() as GnroColumnConfig;
        return column.sticky || column.stickyEnd;
      }
    }
    return false;
  });

  width$ = computed(() => {
    if (this.isSelectionColumn()) {
      return `${ROW_SELECTION_CELL_WIDTH}px`;
    } else {
      const width = this.columnWidths().find((col) => col.name === (this.column() as GnroColumnConfig).name)!.width;
      return `${width}px`;
    }
  });

  flex$ = computed(() => `0 0 ${this.width$()}`);

  private colIndex = computed(() =>
    this.columns().findIndex((column) => column.name === (this.column() as GnroColumnConfig).name),
  );

  left$ = computed(() => {
    if (this.sticky()) {
      if (this.isSelectionColumn()) {
        return `0px`;
      } else if ((this.column() as GnroColumnConfig).sticky) {
        const columns = [...this.columnWidths()].filter((_, idx) => idx < this.colIndex());
        const width = getColumnsWidth(columns, this.gridConfig().rowSelection);
        return `${width}px`;
      }
    }
    return 'unset';
  });
}

/*


    */
