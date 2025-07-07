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
    '[class.gnro-grid-column-last-sticky]': 'isLastSticky$()',

    '[style.height]': 'height$()',
    '[style.flex]': 'flex$()',
    '[style.left]': 'left$()',
    '[style.max-width]': 'width$()',
    '[style.right]': 'right$()',
  },
})
//    [class.gnro-grid-column-last-sticky]="isLastSticky(-1)"
export class GnroGridCellComponent {
  gridConfig = input.required<GnroGridConfig>();
  selected = input.required<boolean>();
  rowIndex = input.required<number>();
  column = input.required<GnroColumnConfig | string>();
  columns = input.required<GnroColumnConfig[]>();
  columnWidths = input.required<GnroColumnWidth[]>();
  private colIndex = computed(() =>
    this.columns().findIndex((column) => column.name === (this.column() as GnroColumnConfig).name),
  );
  private isSelectionColumn = computed(() => typeof this.column() === 'string' && this.column() === 'selection');
  height$ = computed(() => `${this.gridConfig().rowHeight}px`);
  flex$ = computed(() => `0 0 ${this.width$()}`);

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

  right$ = computed(() => {
    if (this.sticky() && !this.isSelectionColumn() && (this.column() as GnroColumnConfig).stickyEnd) {
      const columns = [...this.columnWidths()].filter((_, idx) => idx > this.colIndex());
      const width = getColumnsWidth(columns, false);
      return `${width}px`;
    }
    return 'unset';
  });

  isLastSticky$ = computed(() => {
    if (this.sticky()) {
      const index = this.isSelectionColumn() ? -1 : this.colIndex();
      const totSticky = [...this.columns()].filter((col) => col.sticky).length;
      return index === totSticky - 1;
    }
    return false;
  });
}

/*

    */
