import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ROW_SELECTION_CELL_WIDTH } from '../../models/constants';
import { GnroColumnConfig, GnroColumnWidth, GnroGridConfig } from '../../models/grid.model';
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
    '[class.gnro-grid-column-first-sticky-end]': 'isFirstStickyEnd$()',
    '[style.height]': 'height$()',
    '[style.flex]': 'flex$()',
    '[style.left]': 'left$()',
    '[style.max-width]': 'width$()',
    '[style.right]': 'right$()',
  },
})
export class GnroGridCellComponent {
  gridConfig = input.required<GnroGridConfig>();
  selected = input.required<boolean>();
  rowIndex = input.required<number>();
  column = input<GnroColumnConfig | undefined>(undefined);
  colIndex = input.required<number>();
  columns = input.required<GnroColumnConfig[]>();
  columnWidths = input.required<GnroColumnWidth[]>();
  private isSelectionColumn = computed(() => this.colIndex() === -1);
  height$ = computed(() => `${this.gridConfig().rowHeight}px`);
  flex$ = computed(() => `0 0 ${this.width$()}`);

  sticky = computed(() => {
    if (this.gridConfig().columnSticky) {
      if (this.isSelectionColumn()) {
        return true;
      } else {
        return this.column()!.sticky || this.column()!.stickyEnd;
      }
    }
    return false;
  });

  width$ = computed(() => {
    if (this.isSelectionColumn()) {
      return `${ROW_SELECTION_CELL_WIDTH}px`;
    } else {
      const width = this.columnWidths().find((col) => col.name === this.column()!.name)!.width;
      return `${width}px`;
    }
  });

  left$ = computed(() => {
    if (this.sticky()) {
      if (this.isSelectionColumn()) {
        return `0px`;
      } else if (this.column()!.sticky) {
        const columns = [...this.columnWidths()].filter((_, idx) => idx < this.colIndex());
        const width = getColumnsWidth(columns, this.gridConfig().rowSelection);
        return `${width}px`;
      }
    }
    return 'unset';
  });

  right$ = computed(() => {
    if (this.sticky() && !this.isSelectionColumn() && this.column()!.stickyEnd) {
      const columns = [...this.columnWidths()].filter((_, idx) => idx > this.colIndex());
      const width = getColumnsWidth(columns, false);
      return `${width}px`;
    }
    return 'unset';
  });

  isLastSticky$ = computed(() => {
    if (this.sticky()) {
      //const index = this.isSelectionColumn() ? -1 : this.colIndex();
      return this.colIndex() === [...this.columns()].filter((col) => col.sticky).length - 1;
    }
    return false;
  });

  isFirstStickyEnd$ = computed(() => {
    if (this.sticky()) {
      //const index = this.isSelectionColumn() ? -1 : this.colIndex();
      return this.colIndex() === [...this.columns()].findIndex((col) => col.stickyEnd);
    }
    return false;
  });
}
