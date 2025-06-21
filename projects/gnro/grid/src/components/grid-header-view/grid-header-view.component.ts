import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { GnroGridFacade } from '../../+state/grid.facade';
import { ROW_SELECTION_CELL_WIDTH } from '../../models/constants';
import { DragDropEvent } from '../../models/drag-drop-event';
import { GnroColumnConfig, GnroColumnWidth, GnroGridConfig, GnroGridSetting } from '../../models/grid.model';
import { groupColumnMove } from '../../utils/group-column-move';
import { getTableWidth, viewportWidthRatio } from '../../utils/viewport-width-ratio';
import { GnroGridGroupHeaderComponent } from '../grid-header/grid-group-header/grid-group-header.component';
import { GnroGridHeaderComponent } from '../grid-header/grid-header.component';

@Component({
  selector: 'gnro-grid-header-view',
  templateUrl: './grid-header-view.component.html',
  styleUrls: ['./grid-header-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, ScrollingModule, GnroGridHeaderComponent, GnroGridGroupHeaderComponent],
})
export class GnroGridHeaderViewComponent {
  private readonly gridFacade = inject(GnroGridFacade);
  tableWidth: number = 1000;
  gridSetting = input.required<GnroGridSetting>();
  columnHeaderPosition = input<number>(0);
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
  columnWidths = computed(() => {
    const w = this.gridConfig().horizontalScroll ? getTableWidth(this.columns()) : this.gridSetting().viewportWidth;
    this.tableWidth = w;
    const displayColumns = [...this.resizedColumns()].filter((column) => column.hidden !== true);
    let tot = this.gridConfig().rowSelection ? ROW_SELECTION_CELL_WIDTH : 0;
    const columnWidths = displayColumns.map((column, index) => {
      const resizeable = this.columns().find((col) => col.name === column.name)?.resizeable;
      let width = resizeable === false ? column.width! : Math.round(this.widthRatio() * column.width!);
      tot += width;
      //TODO this will have issue when last column (too small) is stickyEnd
      if (index === displayColumns.length - 1) {
        width += this.tableWidth - tot;
      }
      return {
        name: column.name,
        width: width,
      };
    });
    this.gridColumnWidthsEvent.emit(columnWidths);
    return columnWidths;
  });
  gridColumnWidthsEvent = output<GnroColumnWidth[]>();

  onColumnResizing(columnWidths: GnroColumnWidth[]): void {
    this.resizedColumns.set(columnWidths);
    this.isResizing.set(true);
    if (this.gridConfig().horizontalScroll) {
      this.tableWidth = getTableWidth(columnWidths);
    }
  }

  onColumnResized(columnWidths: GnroColumnWidth[]): void {
    const columns: GnroColumnConfig[] = [...this.columns()].map((column, index) => {
      const resizeable = this.columns().find((col) => col.name === column.name)?.resizeable;
      const ratio = resizeable === false ? 1 : this.widthRatio();
      return {
        ...column,
        width: columnWidths[index].width / ratio,
      };
    });
    this.resizedColumns.set(this.columns());
    this.isResizing.set(false);
    this.gridFacade.setGridColumnsConfig(this.gridConfig(), this.gridSetting(), columns);
  }

  onColumnDragDrop(events: DragDropEvent): void {
    const previousIndex = this.indexCorrection(events.previousIndex);
    const currentIndex = this.indexCorrection(events.currentIndex);
    if (this.gridConfig().groupHeader) {
      this.moveGroupColumn(previousIndex, currentIndex);
    } else {
      this.moveColumn(previousIndex, currentIndex);
    }
  }

  private moveGroupColumn(previousIndex: number, currentIndex: number): void {
    const columns = groupColumnMove(previousIndex, currentIndex, [...this.columns()]);
    this.gridFacade.setGridColumnsConfig(this.gridConfig(), this.gridSetting(), columns);
    this.columns.set(columns);
  }

  private moveColumn(previousIndex: number, currentIndex: number): void {
    const columns = [...this.columns()];
    moveItemInArray(columns, previousIndex, currentIndex);
    this.gridFacade.setGridColumnsConfig(this.gridConfig(), this.gridSetting(), columns);
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
