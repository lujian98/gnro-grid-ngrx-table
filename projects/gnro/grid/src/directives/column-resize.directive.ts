import { Directive, ElementRef, inject, input, output, Renderer2, computed } from '@angular/core';
import { MIN_GRID_COLUMN_WIDTH } from '../models/constants';
import { EventTargetTypes } from '../models/event-target-types';
import { EventTypes } from '../models/event-types';
import {
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridConfig,
  GnroGridSetting,
  GnroGroupHeader,
} from '../models/grid.model';
import { viewportWidthRatio } from '../utils/viewport-width-ratio';

@Directive({
  selector: '[gnroColumnResize]',
})
export class GnroColumnResizeDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  column = input.required<GnroColumnConfig>();
  columns = input.required<GnroColumnConfig[]>();
  gridConfig = input.required<GnroGridConfig>();
  gridSetting = input.required<GnroGridSetting>();
  groupHeader = input<boolean>(false);
  private column$ = computed(() => {
    if (this.groupHeader()) {
      return this.columns().find((column) => column.name === (this.column() as GnroGroupHeader).field);
    } else {
      return this.column();
    }
  });
  columnResizing = output<GnroColumnWidth[]>();
  columnResized = output<GnroColumnWidth[]>();

  private columnWidths: GnroColumnWidth[] = [];
  private currentIndex: number = 0;
  private columnInResizeMode = false;
  private resizeStartPositionX!: number;
  private currentWidth!: number;

  get displayedColumns(): GnroColumnConfig[] {
    return this.columns().filter((column) => column.hidden !== true);
  }

  get element(): HTMLBaseElement {
    return this.elementRef.nativeElement;
  }

  get elementWidth(): number {
    const width = this.element.getBoundingClientRect().width;
    if (this.groupHeader() && this.column$()!.groupHeader) {
      const totalWidth = this.columns()
        .filter((col) => col.groupHeader === this.column$()!.groupHeader)
        .reduce((sum, col) => sum + col.width!, 0);
      return (this.column$()!.width! * width) / totalWidth;
    }
    return width;
  }

  onMouseDown(event: MouseEvent): void {
    this.currentIndex = this.displayedColumns.findIndex((item) => item.name === this.column$()!.name);
    this.columnWidths = [...this.displayedColumns].map((column) => {
      const resizeable = this.columns().find((col) => col.name === column.name)?.resizeable;
      const ratio = viewportWidthRatio(this.gridConfig(), this.gridSetting(), this.displayedColumns);
      return {
        name: column.name,
        width: resizeable === false ? column.width! : ratio * column.width!,
      };
    });
    event.stopPropagation();
    this.columnInResizeMode = true;
    this.resizeStartPositionX = event.x;
    this.currentWidth = this.elementWidth;
    this.registerMouseEvents();
  }

  onMouseUp(event: MouseEvent): void {
    event.stopPropagation();
    if (this.columnInResizeMode) {
      this.columnResized.emit(this.getColumnResizeEventData(event.x));
      this.columnInResizeMode = false;
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.columnInResizeMode) {
      this.columnResizing.emit(this.getColumnResizeEventData(event.x));
    }
  }

  private registerMouseEvents(): void {
    const unregisterMouseMove = this.renderer.listen(
      EventTargetTypes.Document,
      EventTypes.MouseMove,
      (mouseMoveEvent: MouseEvent) => {
        this.onMouseMove(mouseMoveEvent);
      },
    );

    const unregisterContextMenu = this.renderer.listen(
      EventTargetTypes.Document,
      EventTypes.ContextMenu,
      (contextmenu: MouseEvent) => {
        contextmenu.preventDefault();
      },
    );

    const unregisterMouseUp = this.renderer.listen(
      EventTargetTypes.Document,
      EventTypes.MouseUp,
      (mouseUpEvent: MouseEvent) => {
        this.onMouseUp(mouseUpEvent);
        unregisterMouseUp();
        unregisterMouseMove();
        unregisterContextMenu();
      },
    );
  }

  private getColumnResizeEventData(currentPositionX: number): GnroColumnWidth[] {
    const width = this.currentWidth - Number(this.resizeStartPositionX - currentPositionX);
    let dx = width - this.columnWidths[this.currentIndex].width;
    let nextIndex = this.currentIndex + 1;
    const columnWidths = [...this.columnWidths].map((column, idx) => {
      const resizeable = this.columns().find((col) => col.name === column.name)?.resizeable;
      let width = column.width!;
      if (resizeable !== false) {
        if (idx == this.currentIndex) {
          width = column.width! + dx;
          if (width < MIN_GRID_COLUMN_WIDTH) {
            width = MIN_GRID_COLUMN_WIDTH;
            dx = 0;
          }
        } else if (idx == nextIndex && !this.gridConfig().horizontalScroll) {
          width = column.width! - dx;
          if (width < MIN_GRID_COLUMN_WIDTH) {
            width = MIN_GRID_COLUMN_WIDTH;
            if (nextIndex === this.columnWidths.length - 1) {
              dx = 0;
            }
            nextIndex++;
          }
        }
      } else if (idx > this.currentIndex) {
        nextIndex++;
      }
      return {
        name: column.name,
        width: width!,
      };
    });
    return columnWidths;
  }
}
