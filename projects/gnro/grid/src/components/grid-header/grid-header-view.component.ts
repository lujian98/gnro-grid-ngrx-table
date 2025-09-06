import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { GnroGridFacade } from '../../+state/grid.facade';
import { ROW_SELECTION_CELL_WIDTH } from '../../models/constants';
import { DragDropEvent } from '../../models/drag-drop-event';
import {
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridConfig,
  GnroGridRowSelections,
  GnroGridSetting,
} from '../../models/grid.model';
import { groupColumnMove } from '../../utils/group-column-move';
import { getTableWidth, viewportWidthRatio } from '../../utils/viewport-width-ratio';
import { GnroGridGroupHeaderComponent } from './grid-group-header/grid-group-header.component';
import { GnroGridHeaderComponent } from './grid-header/grid-header.component';

@Component({
  selector: 'gnro-grid-header-view',
  templateUrl: './grid-header-view.component.html',
  styleUrls: ['./grid-header-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, ScrollingModule, GnroGridHeaderComponent, GnroGridGroupHeaderComponent],
})
export class GnroGridHeaderViewComponent {
  private readonly gridFacade = inject(GnroGridFacade);
  gridSetting = input.required<GnroGridSetting>();
  columnHeaderPosition = input<number>(0);
  rowSelection = input.required<GnroGridRowSelections<object>>();
  gridConfig = input.required<GnroGridConfig>();
  columnConfigs = input.required({
    transform: (columnConfigs: GnroColumnConfig[]) => {
      this.columns.set(columnConfigs);
      this.resizedColumns.set(this.columns());
      this.columnWidths();
      return columnConfigs;
    },
  });
  columns = signal<GnroColumnConfig[]>([]);
  resizedColumns = signal<GnroColumnConfig[]>([]);
  isResizing = signal<boolean>(false);
  widthRatio = computed(() => {
    return this.isResizing() ? 1 : viewportWidthRatio(this.gridConfig(), this.gridSetting(), this.columns());
  });
  tableWidth = computed(() =>
    this.gridConfig().horizontalScroll
      ? getTableWidth(this.columns(), this.gridConfig())
      : this.gridSetting().viewportWidth,
  );
  columnWidths = computed(() => {
    const displayColumns = [...this.resizedColumns()].filter((column) => column.hidden !== true);
    let tot = this.gridConfig().rowSelection ? ROW_SELECTION_CELL_WIDTH : 0;
    const columnWidths = displayColumns.map((column, index) => {
      const resizeable = this.columns().find((col) => col.name === column.name)?.resizeable;
      let width = resizeable === false ? column.width! : Math.round(this.widthRatio() * column.width!);
      tot += width;
      if (index === displayColumns.length - 1) {
        width += this.tableWidth() - tot;
      }
      return { name: column.name, width: width };
    });
    this.gridColumnWidthsEvent.emit(columnWidths);
    return columnWidths;
  });

  gridColumnWidthsEvent = output<GnroColumnWidth[]>();
  gridDragDropStickyEvent = output<string>();
  rowSelectAll = output<boolean>();

  onRowSelectAll(allSelected: boolean): void {
    this.rowSelectAll.emit(allSelected);
  }

  onColumnResizing(columnWidths: GnroColumnWidth[]): void {
    this.resizedColumns.set(columnWidths);
    this.isResizing.set(true);
    if (this.gridConfig().horizontalScroll) {
      //this.tableWidth = getTableWidth(columnWidths, this.gridConfig());
    }
  }

  onColumnResized(columnWidths: GnroColumnWidth[]): void {
    const columns: GnroColumnConfig[] = [...this.columns()].map((column, index) => {
      const resizeable = this.columns().find((col) => col.name === column.name)?.resizeable;
      const ratio = resizeable === false ? 1 : this.widthRatio();
      const find = columnWidths.find((col) => col.name == column.name);
      return {
        ...column,
        width: find ? find.width / ratio : column.width,
      };
    });

    this.resizedColumns.set(this.columns());
    this.isResizing.set(false);
    this.gridFacade.setColumnsConfig(this.gridConfig(), this.gridSetting(), columns);
  }

  onColumnDragDrop(events: DragDropEvent): void {
    const previousIndex = this.indexCorrection(events.previousIndex);
    const currentIndex = this.indexCorrection(events.currentIndex);
    if (this.isDroppabe(previousIndex, currentIndex)) {
      if (this.gridConfig().groupHeader) {
        this.moveGroupColumn(previousIndex, currentIndex);
      } else {
        this.moveColumn(previousIndex, currentIndex);
      }
    }
  }

  // cdk cdkDropListEnterPredicate not working?? use isDroppabe for now
  private isDroppabe(previousIndex: number, currentIndex: number): boolean {
    const prevCol = this.columns().find((col, index) => previousIndex === index);
    const currCol = this.columns().find((col, index) => currentIndex === index);
    if (this.gridSetting().isTreeGrid && (prevCol?.name === 'name' || currCol?.name === 'name')) {
      return false;
    }
    if (this.gridConfig().columnSticky) {
      if (prevCol?.sticky) {
        this.gridDragDropStickyEvent.emit('sticky');
      } else if (prevCol?.stickyEnd) {
        this.gridDragDropStickyEvent.emit('stickyEnd');
      }
      if (prevCol?.sticky && currCol?.sticky) {
        return true;
      } else if (prevCol?.stickyEnd && currCol?.stickyEnd) {
        return true;
      } else if (!prevCol?.sticky && !currCol?.sticky && !prevCol?.stickyEnd && !currCol?.stickyEnd) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  private moveGroupColumn(previousIndex: number, currentIndex: number): void {
    const columns = groupColumnMove(previousIndex, currentIndex, [...this.columns()]);
    this.gridFacade.setColumnsConfig(this.gridConfig(), this.gridSetting(), columns);
    this.columns.set(columns);
  }

  private moveColumn(previousIndex: number, currentIndex: number): void {
    const columns = [...this.columns()];
    moveItemInArray(columns, previousIndex, currentIndex);
    this.gridFacade.setColumnsConfig(this.gridConfig(), this.gridSetting(), columns);
  }

  private indexCorrection(idx: number): number {
    this.columns().forEach((column, index) => {
      if (column.hidden && idx >= index) {
        idx++;
      }
    });
    return idx;
  }
}
