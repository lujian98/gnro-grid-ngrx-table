import { CdkDragHandle, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output } from '@angular/core';
import { DEFAULT_OVERLAY_SERVICE_CONFIG, GnroOverlayServiceConfig, GnroPosition, GnroTrigger } from '@gnro/ui/overlay';
import { GnroPopoverComponent, GnroPopoverService } from '@gnro/ui/popover';
import { GnroGridFacade } from '../../../+state/grid.facade';
import { GnroColumnResizeTriggerDirective } from '../../../directives/column-resize-trigger.directive';
import { GnroColumnResizeDirective } from '../../../directives/column-resize.directive';
import { GRID_FILTER_ROW_HEIGHT } from '../../../models/constants';
import {
  ColumnMenuClick,
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridConfig,
  GnroGridRowSelections,
  GnroGridSetting,
} from '../../../models/grid.model';
import { GnroColumnFilterComponent } from '../../column-filter/column-filter.component';
import { GnroRowSelectComponent } from '../../row-select/row-select.component';
import { GnroGridColumnMenuComponent } from '../grid-column-menu/grid-column-menu.component';
import { GnroGridHeaderCellComponent } from '../grid-header-cell/grid-header-cell.component';
import { GnroGridHeaderItemComponent } from '../grid-header-item/grid-header-item.component';

@Component({
  selector: 'gnro-grid-header',
  templateUrl: './grid-header.component.html',
  styleUrls: ['./grid-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    CdkDragHandle,
    GnroGridHeaderCellComponent,
    GnroGridHeaderItemComponent,
    GnroColumnResizeDirective,
    GnroColumnResizeTriggerDirective,
    GnroColumnFilterComponent,
    GnroRowSelectComponent,
  ],
  providers: [GnroPopoverService],
  host: {
    '[style.left]': 'left$()',
  },
})
export class GnroGridHeaderComponent<T> {
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly popoverService = inject(GnroPopoverService);
  private readonly elementRef = inject(ElementRef);
  gridSetting = input.required<GnroGridSetting>();
  gridConfig = input.required<GnroGridConfig>();
  columns = input.required<GnroColumnConfig[]>();
  columnWidths = input.required<GnroColumnWidth[]>();
  columnHeaderPosition = input<number>(0);
  rowSelection = input.required<GnroGridRowSelections<object>>();
  left$ = computed(() => `${this.columnHeaderPosition()}px`);
  columnResizing = output<GnroColumnWidth[]>();
  columnResized = output<GnroColumnWidth[]>();
  rowSelectAll = output<boolean>();

  get filterRowHeight(): string {
    return `${GRID_FILTER_ROW_HEIGHT + 1}px`;
  }

  get columnResizeHeight(): number {
    return 32 + (this.gridConfig().columnFilter ? 28 : 0);
  }

  trackByIndex(index: number): number {
    return index;
  }

  resizeable(column: GnroColumnConfig, index: number): boolean {
    const nextResizeable = this.columns().filter((col, idx) => idx > index && col.resizeable !== false).length;
    return (
      this.gridConfig().columnResize &&
      column.resizeable !== false &&
      (nextResizeable > 0 || this.gridConfig().horizontalScroll)
    );
  }

  dragDisabled(column: GnroColumnConfig): boolean {
    return !(this.gridConfig().columnReorder && column.draggable !== false);
  }

  onToggleSelectAll(allSelected: boolean): void {
    this.rowSelectAll.emit(allSelected);
    this.gridFacade.setSelectAllRows(this.gridSetting().gridId, !allSelected);
  }

  onColumnMenuClick(menuClick: ColumnMenuClick): void {
    let values: { [key: string]: boolean } = {};
    [...this.columns()].forEach((column) => {
      values[column.name] = !column.hidden;
    });
    const popoverContext = {
      gridId: this.gridSetting().gridId,
      column: menuClick.column,
      columns: this.columns(),
      values: values,
    };
    this.buildPopover(popoverContext, menuClick.event);
  }

  //build column menu use POINT not depened on the grid column so it will not close the menu panel
  private buildPopover(popoverContext: Object, event: MouseEvent): void {
    const overlayServiceConfig: GnroOverlayServiceConfig = {
      ...DEFAULT_OVERLAY_SERVICE_CONFIG,
      trigger: GnroTrigger.POINT,
      position: GnroPosition.BOTTOM_END,
      event,
    };
    this.popoverService.build(
      GnroPopoverComponent,
      this.elementRef,
      overlayServiceConfig,
      GnroGridColumnMenuComponent,
      popoverContext,
    );
    this.showMenu();
  }

  private showMenu(): void {
    this.hideMenu();
    this.popoverService.show();
  }

  private hideMenu(): void {
    this.popoverService.hide();
  }
}
