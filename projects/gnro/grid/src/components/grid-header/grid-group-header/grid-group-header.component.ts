import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { GnroColumnResizeTriggerDirective } from '../../../directives/column-resize-trigger.directive';
import { GnroColumnResizeDirective } from '../../../directives/column-resize.directive';
import { ROW_SELECTION_CELL_WIDTH } from '../../../models/constants';
import {
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridConfig,
  GnroGridSetting,
  GnroGroupHeader,
} from '../../../models/grid.model';
import { getTableWidth } from '../../../utils/viewport-width-ratio';
import { GnroGridHeaderItemComponent } from '../grid-header-item/grid-header-item.component';

@Component({
  selector: 'gnro-grid-group-header',
  templateUrl: './grid-group-header.component.html',
  styleUrls: ['./grid-group-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroGridHeaderItemComponent, GnroColumnResizeTriggerDirective, GnroColumnResizeDirective],
})
export class GnroGridGroupHeaderComponent {
  rowSelectionCellWidth = ROW_SELECTION_CELL_WIDTH;
  columns = input.required<GnroColumnConfig[]>();
  gridSetting = input.required<GnroGridSetting>();
  gridConfig = input.required<GnroGridConfig>();
  columnWidths = input<GnroColumnWidth[]>([]);
  columnHeaderPosition = input<number>(0);
  groupHeaderColumns = computed(() => {
    let groupHeaders: GnroGroupHeader[] = [];
    this.columns().forEach((column) => {
      if (!column.hidden) {
        groupHeaders = this.getGroupHeader(column, groupHeaders);
      }
    });
    return groupHeaders;
  });
  columnResizing = output<GnroColumnWidth[]>();
  columnResized = output<GnroColumnWidth[]>();

  getColumn(header: GnroGroupHeader): GnroColumnConfig {
    return this.columns().find((col) => col.name === header.field)!;
  }

  getStickyLeft(sticky: boolean | undefined, stickyEnd: boolean | undefined): string {
    if (sticky) {
      return `${-this.columnHeaderPosition()}px`;
    } else if (stickyEnd) {
      const width = getTableWidth(this.columns()) - this.gridSetting().viewportWidth;
      const postion = -width - this.columnHeaderPosition();
      return `${postion}px`;
    } else {
      return `0px`;
    }
  }

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

  getHeaderWidth(header: GnroGroupHeader): string {
    let width = 0;
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
  }
}
