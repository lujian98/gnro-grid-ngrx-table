import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import {
  ColumnMenuClick,
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridConfig,
  GnroGridSetting,
  GnroGridRowSelections,
  GnroGroupHeader,
} from '../../../models/grid.model';

@Component({
  selector: 'gnro-grid-header-item',
  template: '<ng-content></ng-content>',
  styleUrls: ['./grid-header-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.gnro-grid-header-sticky]': 'sticky()',
    '[class.gnro-grid-column-last-sticky]': 'isLastSticky$()',
    '[class.gnro-grid-column-first-sticky-end]': 'isFirstStickyEnd$()',
  },
})
//      [class.gnro-grid-column-first-sticky-end]="isFirstStickyEnd(index)"
export class GnroGridHeaderItemComponent {
  gridConfig = input.required<GnroGridConfig>();
  groupHeader = input<boolean>(false);
  column = input.required<GnroColumnConfig | GnroGroupHeader | string>();
  colIndex = input.required<number>();
  columns = input.required<GnroColumnConfig[]>();
  columnWidths = input.required<GnroColumnWidth[]>();
  columnHeaderPosition = input<number>(0);
  private isSelectionColumn = computed(() => typeof this.column() === 'string' && this.column() === 'selection');

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
        // TODO bug here
        let newindex = this.colIndex();
        if (this.colIndex() > -1) {
          const header = this.groupHeaderColumns()[this.colIndex()];
          if (header.isGroupHeader) {
            const group = this.columns().filter((col) => col.groupHeader?.name === header.name);
            newindex += group.length - 1;
          }
        }
        const totSticky = [...this.columns()].filter((col) => col.sticky).length;
        return newindex === totSticky - 1;
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
  /*

    */
  groupHeaderColumns = computed(() => {
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
