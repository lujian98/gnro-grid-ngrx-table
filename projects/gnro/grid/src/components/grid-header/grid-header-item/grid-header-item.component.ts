import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ROW_SELECTION_CELL_WIDTH } from '../../../models/constants';
import {
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridConfig,
  GnroGridSetting,
  GnroGroupHeader,
} from '../../../models/grid.model';
import { getTableWidth } from '../../../utils/viewport-width-ratio';

@Component({
  selector: 'gnro-grid-header-item',
  template: '<ng-content></ng-content>',
  styleUrls: ['./grid-header-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.gnro-grid-header-sticky]': 'sticky()',
    '[class.gnro-grid-column-last-sticky]': 'isLastSticky$()',
    '[class.gnro-grid-column-first-sticky-end]': 'isFirstStickyEnd$()',
    '[style.flex]': 'flex$()',
    '[style.left]': 'left$()',
    '[style.max-width]': 'width$()',
  },
})
export class GnroGridHeaderItemComponent {
  gridConfig = input.required<GnroGridConfig>();
  gridSetting = input.required<GnroGridSetting>();
  groupHeader = input<boolean>(false);
  column = input<GnroColumnConfig | GnroGroupHeader>();
  colIndex = input.required<number>();
  columns = input.required<GnroColumnConfig[]>();
  columnWidths = input.required<GnroColumnWidth[]>();
  columnHeaderPosition = input<number>(0);
  groupHeaderColumns = input<GnroGroupHeader[]>([]);
  private isSelectionColumn = computed(() => this.colIndex() === -1);
  flex$ = computed(() => `0 0 ${this.width$()}`);

  sticky = computed(() => {
    if (this.gridConfig().columnSticky) {
      if (this.isSelectionColumn()) {
        return true;
      }
      const column = this.column() as GnroGroupHeader;
      if (column.isGroupHeader) {
        const item = this.columns().find((col) => col.groupHeader?.name === column.name);
        return !!item?.sticky || !!item?.stickyEnd;
      } else if (column.field) {
        const item = this.columns().find((col) => col.name === column.field);
        return !!item?.sticky || !!item?.stickyEnd;
      } else {
        const item = this.column() as GnroColumnConfig;
        return item.sticky || item.stickyEnd;
      }
    }
    return false;
  });

  isLastSticky$ = computed(() => {
    if (this.sticky()) {
      if (this.groupHeader()) {
        const items = [...this.columns()].filter((col) => col.sticky);
        const lastIndex =
          items.length > 0 ? this.columns().findIndex((col) => col.name === items[items.length - 1].name) : -1;
        return lastIndex === this.findColumnIndex();
      } else {
        return this.colIndex() === [...this.columns()].filter((col) => col.sticky).length - 1;
      }
    }
    return false;
  });

  private findColumnIndex(): number {
    if (this.colIndex() === -1) {
      return this.colIndex();
    } else {
      const header = this.groupHeaderColumns()[this.colIndex()];
      if (header.isGroupHeader) {
        const items = this.columns().filter((col) => col.groupHeader?.name === header.name);
        return this.columns().findIndex((col) => col.name === items[items.length - 1].name);
      } else {
        return this.columns().findIndex((col) => col.name === header.field);
      }
    }
  }

  isFirstStickyEnd$ = computed(() => {
    if (this.sticky() && this.colIndex() > 0) {
      if (this.groupHeader()) {
        const header = this.groupHeaderColumns()[this.colIndex()];
        const firstIndex = [...this.columns()].findIndex((col) => col.stickyEnd);
        const findIndex = header.isGroupHeader
          ? this.columns().findIndex((col) => col.groupHeader?.name === header.name)
          : this.columns().findIndex((col) => col.name === header.field);
        return findIndex === firstIndex;
      } else {
        return this.colIndex() === [...this.columns()].findIndex((col) => col.stickyEnd);
      }
    }
    return false;
  });

  width$ = computed(() => {
    if (this.isSelectionColumn()) {
      return `${ROW_SELECTION_CELL_WIDTH}px`;
    } else if (this.groupHeader()) {
      let width = 0;
      const header = this.column() as GnroGroupHeader;
      if (!header.isGroupHeader) {
        width = this.columnWidths().find((col) => col.name === header.field)!.width;
      } else {
        const columns = this.columns().filter((col) => col.groupHeader?.name === header.name);
        columns.forEach((column) => {
          const find = this.columnWidths().find((col) => col.name === column.name);
          if (find) {
            width += find.width;
          }
        });
      }
      return width ? `${width}px` : '';
    } else {
      const width = this.columnWidths().find((col) => col.name === (this.column() as GnroColumnConfig).name)!.width;
      return `${width}px`;
    }
  });

  left$ = computed(() => {
    if (this.isSelectionColumn()) {
      return this.getStickyLeft(this.gridConfig().columnSticky, false);
    } else if (this.groupHeader()) {
      const column = this.columns().find((col) => col.name === (this.column() as GnroGroupHeader).field);
      return this.getStickyLeft(column?.sticky, column?.stickyEnd);
    } else {
      const column = this.column() as GnroColumnConfig;
      return this.getStickyLeft(column.sticky, column.stickyEnd);
    }
  });

  private getStickyLeft(sticky: boolean | undefined, stickyEnd: boolean | undefined): string {
    if (this.gridConfig().columnSticky) {
      if (sticky) {
        return `${-this.columnHeaderPosition()}px`;
      } else if (stickyEnd) {
        const width = getTableWidth(this.columns(), this.gridConfig()) - this.gridSetting().viewportWidth;
        const postion = -width - this.columnHeaderPosition();
        return `${postion}px`;
      }
    }
    return `0px`;
  }
}
