import { SelectionModel } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  Signal,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import { uniqueId } from '@gnro/ui/core';
import { BehaviorSubject, Subject, interval, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, switchMap, take, takeUntil } from 'rxjs/operators';
import { GnroGridFacade } from '../+state/grid.facade';
import { GnroColumnConfig, GnroColumnWidth, GnroGridConfig, GnroGridSetting } from '../models/grid.model';
import { GnroRowGroup } from '../utils/row-group/row-group';
import { GnroRowGroups } from '../utils/row-group/row-groups';
import { getTableWidth } from '../utils/viewport-width-ratio';
import { GnroGridHeaderViewComponent } from './grid-header-view/grid-header-view.component';
import { GnroGridRowGroupComponent } from './grid-row/grid-row-group.component';
import { GnroGridRowComponent } from './grid-row/grid-row.component';

@Component({
  selector: 'gnro-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, GnroGridRowComponent, GnroGridRowGroupComponent, GnroGridHeaderViewComponent],
})
export class GnroGridViewComponent<T> implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly destroy$ = new Subject<void>();
  private scrollIndex: number = 0;
  private prevRowIndex: number = -1;
  rowSelection$!: Signal<SelectionModel<object>>;
  rowGroups$!: Signal<GnroRowGroups | boolean>;
  sizeChanged$ = new BehaviorSubject<string | MouseEvent | null>(null);
  columnHeaderPosition = 0;
  columnWidths: GnroColumnWidth[] = [];

  gridSetting = input.required({
    transform: (gridSetting: GnroGridSetting) => {
      if (!this.rowSelection$) {
        this.rowSelection$ = this.gridFacade.getRowSelection(gridSetting.gridId);
      }
      if (!this.rowGroups$) {
        this.rowGroups$ = this.gridFacade.getRowGroups(gridSetting.gridId);
      }
      return gridSetting;
    },
  });
  gridConfig = input.required<GnroGridConfig>();
  columns = input.required<GnroColumnConfig[]>();
  gridData = input.required({
    transform: (gridData: object[]) => {
      this.checkViewport(gridData);
      return gridData;
    },
  });

  get tableWidth(): number {
    return this.gridConfig().horizontalScroll
      ? getTableWidth(this.columns(), this.gridConfig())
      : this.gridSetting().viewportWidth;
  }

  gridColumnWidthsEvent(values: GnroColumnWidth[]): void {
    this.columnWidths = values;
  }

  gridDragDropStickyEvent(sticky: string): void {
    const el = this.viewport.elementRef.nativeElement;
    if (sticky === 'sticky') {
      el.scrollLeft = 0;
    } else if (sticky === 'stickyEnd') {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    }
  }

  @ViewChild(CdkVirtualScrollViewport, { static: true }) private viewport!: CdkVirtualScrollViewport;

  ngAfterViewInit(): void {
    interval(10)
      .pipe(take(1))
      .subscribe(() => this.setViewportPageSize());

    this.sizeChanged$
      .pipe(
        skip(1),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((event) => of(event).pipe(takeUntil(this.sizeChanged$.pipe(skip(1))))),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.setViewportPageSize(typeof event === 'string' ? false : true, event);
      });
  }

  trackByIndex(index: number): number {
    return index;
  }

  onScrolledIndexChange(index: number): void {
    if (this.gridConfig().virtualScroll) {
      this.scrollIndex = index;
      const nextPage = this.gridConfig().page + 1;
      const pageSize = this.gridConfig().pageSize;
      const displayTotal = (nextPage - 1) * pageSize;
      if (displayTotal - index < pageSize - 10 && displayTotal < this.gridSetting().totalCounts) {
        this.gridFacade.getGridPageData(this.gridSetting().gridId, nextPage);
      } else {
        this.gridFacade.setGridScrollIndex(this.gridSetting().gridId, this.scrollIndex);
      }
    }
  }

  onToggleRowGroup(rowGroups: GnroRowGroups | boolean): void {
    if (this.gridConfig().virtualScroll && rowGroups instanceof GnroRowGroups) {
      const nextPage = this.gridConfig().page + 1;
      const pageSize = this.gridConfig().pageSize;
      const displayTotal = (nextPage - 1) * pageSize;
      const actualDisplay = displayTotal - rowGroups.totalHiddenCounts;
      if (actualDisplay - this.scrollIndex < pageSize - 10 && displayTotal < this.gridSetting().totalCounts) {
        this.gridFacade.getGridPageData(this.gridSetting().gridId, nextPage);
      }
    }
  }

  onViewportScroll(event: Event): void {
    this.columnHeaderPosition = -(event.target as HTMLElement).scrollLeft;
  }

  private setViewportPageSize(loadData: boolean = true, event?: string | MouseEvent | null): void {
    const clientHeight = this.viewport.elementRef.nativeElement.clientHeight;
    const clientWidth = this.viewport.elementRef.nativeElement.clientWidth;
    const pageSize = Math.floor(clientHeight / this.gridConfig().rowHeight);
    //const pageSize = !this.gridConfig().virtualScroll && !this.gridConfig().verticalScroll ? fitPageSize : this.gridConfig().pageSize;
    if (!event || typeof event === 'string') {
      this.gridFacade.setViewportPageSize(this.gridConfig(), this.gridSetting(), pageSize, clientWidth, loadData);
    } else {
      this.gridFacade.setWindowResize(this.gridConfig(), this.gridSetting(), pageSize, clientWidth, loadData);
    }
  }

  private checkViewport(data: object[]): void {
    const el = this.viewport.elementRef.nativeElement;
    const clientWidth = el.clientWidth;
    const clientHeight = el.clientHeight;
    const pageSize = Math.floor(clientHeight / this.gridConfig().rowHeight);
    if (this.gridConfig().virtualScroll || this.gridConfig().verticalScroll) {
      // make sure column width with vertical scroll are correct
      const widowWidth = this.elementRef.nativeElement.clientWidth;
      if (data.length > pageSize && clientWidth === widowWidth) {
        this.sizeChanged$.next(uniqueId(16));
      } else if (data.length <= pageSize && clientWidth < widowWidth) {
        this.sizeChanged$.next(uniqueId(16));
      }
      this.gridFacade.setViewportPageSize(this.gridConfig(), this.gridSetting(), pageSize, clientWidth, false);
    } else if (pageSize !== this.gridConfig().pageSize) {
      this.gridFacade.setViewportPageSize(this.gridConfig(), this.gridSetting(), pageSize, clientWidth, true);
    }
  }

  isRowGroup(index: number, record: object | GnroRowGroup): boolean {
    return record instanceof GnroRowGroup;
  }

  rowClick(event: MouseEvent, rowIndex: number, record: object): void {
    if (this.gridConfig().rowSelection) {
      if (this.prevRowIndex < 0) {
        this.prevRowIndex = rowIndex;
      }
      const selected = this.rowSelection$().isSelected(record as object);
      if (this.gridConfig().multiRowSelection) {
        if (event.ctrlKey || event.metaKey) {
          this.selectRecord([record], !selected);
        } else if (event.shiftKey) {
          if (rowIndex === this.prevRowIndex) {
            this.selectRecord([record], !selected);
          } else {
            const records = this.getSelectionRange(this.prevRowIndex, rowIndex);
            this.selectRecord(records, true);
          }
        } else {
          if (selected) {
            this.gridFacade.setSelectAllRows(this.gridSetting().gridId, false);
          } else {
            this.gridFacade.setSelectRow(this.gridSetting().gridId, record as object);
          }
        }
      } else {
        this.selectRecord([record], !selected);
      }
      this.prevRowIndex = rowIndex;
    }
  }

  private getSelectionRange(prevRowIndex: number, rowIndex: number): object[] {
    if (prevRowIndex > rowIndex) {
      return [...this.gridData()].slice(rowIndex, prevRowIndex);
    } else {
      return [...this.gridData()].slice(prevRowIndex, rowIndex + 1);
    }
  }

  private selectRecord(record: object[], isSelected: boolean): void {
    const selected = this.getSelectedTotal(record, isSelected);
    this.gridFacade.setSelectRows(this.gridSetting().gridId, record as object[], isSelected, selected);
  }

  private getSelectedTotal(record: object[], isSelected: boolean): number {
    if (this.gridConfig().multiRowSelection) {
      const prevSelectedLength = this.rowSelection$().selected.length;
      if (isSelected) {
        const preSelected = record.filter((item) => this.rowSelection$().isSelected(item));
        return prevSelectedLength - preSelected.length + record.length;
      } else {
        return prevSelectedLength - record.length;
      }
    } else {
      return isSelected ? 1 : 0;
    }
  }

  rowDblClick(record: object): void {
    if (this.gridConfig().hasDetailView) {
      this.gridFacade.rowDblClick(this.gridSetting().gridId, record as object);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    this.sizeChanged$.next(event);
  }

  ngOnDestroy(): void {
    this.sizeChanged$.next(null);
    this.sizeChanged$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
