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
        if (this.colIndex() > -1) {
          const header = this.groupHeaderColumns()[this.colIndex()];
          const list = [...this.columns()].filter((col) => col.sticky);
          const item = list[list.length - 1];
          const lastIndex = this.columns().findIndex((col) => col.name === item.name);
          if (header.isGroupHeader) {
            const group = this.columns().filter((col) => col.groupHeader?.name === header.name);
            const column = group[group.length - 1];
            const findIndex = this.columns().findIndex((col) => col.name === column.name);
            return lastIndex === findIndex;
          } else {
            const findIndex = this.columns().findIndex((col) => col.name === header.field);
            return lastIndex === findIndex;
          }
        }
      } else {
        const totSticky = [...this.columns()].filter((col) => col.sticky).length;
        return this.colIndex() === totSticky - 1;
      }
    }
    return false;
  });

  isFirstStickyEnd$ = computed(() => {
    if (this.sticky() && this.colIndex() > 0) {
      if (this.groupHeader()) {
        const header = this.groupHeaderColumns()[this.colIndex()];
        if (!header.isGroupHeader) {
          const find = this.columns().findIndex((col) => col.name === header.field);
          const idx = [...this.columns()].findIndex((col) => col.stickyEnd);
          return find === idx;
        } else {
          const find = this.columns().findIndex((col) => col.groupHeader?.name === header.name);
          const idx = [...this.columns()].findIndex((col) => col.stickyEnd);
          return find === idx;
        }
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
      return this.getHeaderStickyLeft(this.column() as GnroGroupHeader);
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

  private getHeaderStickyLeft(header: GnroGroupHeader): string {
    if (!header.isGroupHeader) {
      const column = this.columns().find((col) => col.name === header.field);
      return this.getStickyLeft(column?.sticky, column?.stickyEnd);
    } else {
      const column = this.columns().find((col) => col.name === header.field);
      return this.getStickyLeft(column?.sticky, column?.stickyEnd);
    }
  }

  private groupHeaderColumns = computed(() => {
    let groupHeaders: GnroGroupHeader[] = [];
    this.columns().forEach((column) => {
      if (!column.hidden) {
        groupHeaders = this.getGroupHeader(column, groupHeaders);
      }
    });
    return groupHeaders;
  });

  private getGroupHeader(column: GnroColumnConfig, groupHeaders: GnroGroupHeader[]): GnroGroupHeader[] {
    if (column.groupHeader) {
      const find = groupHeaders.find((item) => item.name === column.groupHeader?.name);
      if (!find) {
        const groupHeader = column.groupHeader;
        groupHeader.isGroupHeader = true;
        groupHeader.field = column.name;
        groupHeaders.push(groupHeader);
      } else {
        find.field = column.name;
      }
    } else {
      groupHeaders.push({
        name: `group${column.name}`,
        title: '',
        isGroupHeader: false,
        field: column.name,
      });
    }
    return groupHeaders;
  }
}
