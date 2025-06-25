import { CdkDragDrop, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { uniqueId } from '@gnro/ui/core';
import {
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridFacade,
  GnroGridHeaderViewComponent,
  GnroGridRowSelections,
  GnroGridSetting,
} from '@gnro/ui/grid';
import { GNRO_DOCUMENT } from '@gnro/ui/theme';
import { BehaviorSubject, interval, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, switchMap, take, takeUntil } from 'rxjs/operators';
import { GnroTreeFacade } from '../+state/tree.facade';
import { GnroTreeConfig, GnroTreeDropInfo, GnroTreeNode } from '../models/tree-grid.model';
import { gnroFindNodeId, gnroGetNodeParent } from '../utils/nested-tree';
import { GnroTreeRowComponent } from './tree-row/tree-row.component';

@Component({
  selector: 'gnro-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragDropModule, ScrollingModule, GnroGridHeaderViewComponent, GnroTreeRowComponent],
})
export class GnroTreeViewComponent<T> implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);
  private readonly document = inject(GNRO_DOCUMENT);
  private readonly treeFacade = inject(GnroTreeFacade);
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly destroyRef = inject(DestroyRef);
  private dragNode: GnroTreeNode<T> | null = null;
  private dropInfo: GnroTreeDropInfo<T> | null = null;
  columnHeaderPosition = 0;
  columnWidths = signal<GnroColumnWidth[]>([]);
  private prevRowIndex: number = -1;
  sizeChanged$ = new BehaviorSubject<string | MouseEvent | null>(null);
  gridSetting = input.required({
    transform: (gridSetting: GnroGridSetting) => {
      return gridSetting;
    },
  });
  treeConfig = input.required<GnroTreeConfig>();
  columns = input.required<GnroColumnConfig[]>();
  treeData = input.required({
    transform: (treeData: GnroTreeNode<T>[]) => {
      this.checkViewport(treeData);
      return treeData;
    },
  });
  rowSelection = input.required<GnroGridRowSelections<object>>();

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
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.setViewportPageSize(typeof event === 'string' ? false : true, event));
  }

  trackByIndex(index: number): number {
    return index;
  }

  gridColumnWidthsEvent(values: GnroColumnWidth[]): void {
    this.columnWidths.set(values);
  }

  onScrolledIndexChange(index: number): void {}

  onViewportScroll(event: Event): void {
    this.columnHeaderPosition = -(event.target as HTMLElement).scrollLeft;
  }

  private setViewportPageSize(loadData: boolean = true, event?: string | MouseEvent | null): void {
    const clientHeight = this.viewport.elementRef.nativeElement.clientHeight;
    const clientWidth = this.viewport.elementRef.nativeElement.clientWidth;
    const fitPageSize = Math.floor(clientHeight / this.treeConfig().rowHeight);
    const pageSize =
      !this.treeConfig().virtualScroll && !this.treeConfig().verticalScroll ? fitPageSize : this.treeConfig().pageSize;
    this.gridFacade.setViewportPageSize(this.treeConfig(), this.gridSetting(), pageSize, clientWidth, loadData);
    if (loadData) {
      if (!event || typeof event === 'string') {
        this.treeFacade.viewportReadyLoadData(this.gridSetting().gridId, this.treeConfig(), this.gridSetting());
      } else {
        this.treeFacade.windowResizeLoadData(this.gridSetting().gridId, this.treeConfig(), this.gridSetting());
      }
    }
  }

  private checkViewport(data: GnroTreeNode<T>[]): void {
    if (this.treeConfig().virtualScroll || this.treeConfig().verticalScroll) {
      // make sure column width with vertical scroll are correct
      const el = this.viewport.elementRef.nativeElement;
      const clientHeight = el.clientHeight;
      const clientWidth = el.clientWidth;
      const widowWidth = this.elementRef.nativeElement.clientWidth;
      const pageSize = Math.floor(clientHeight / this.treeConfig().rowHeight);
      if (data.length > pageSize && clientWidth === widowWidth) {
        this.sizeChanged$.next(uniqueId(16));
      } else if (data.length <= pageSize && clientWidth < widowWidth) {
        this.sizeChanged$.next(uniqueId(16));
      }
    }
  }

  dragStart(node: GnroTreeNode<T>): void {
    this.dragNode = node;
  }

  dragMoved(event: CdkDragMove, nodes: GnroTreeNode<T>[]): void {
    this.dropInfo = null;
    const e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
    if (!e) {
      this.clearDragInfo();
      return;
    }
    const container = e.classList.contains('gnro-tree-row') ? e : e.closest('.gnro-tree-node');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    const target = gnroFindNodeId(container.getAttribute('tree-node-id')!, nodes)!;
    if (this.isNodeDroppable(target, nodes)) {
      this.dropInfo = {
        target: target,
      };
      const targetRect = container.getBoundingClientRect();
      const oneThird = targetRect.height / 3;
      if (event.pointerPosition.y - targetRect.top < oneThird && this.isDroppablePosition(target, 'before', nodes)) {
        this.dropInfo.position = 'before';
      } else if (
        event.pointerPosition.y - targetRect.top > 2 * oneThird &&
        this.isDroppablePosition(target, 'after', nodes)
      ) {
        this.dropInfo.position = 'after';
      } else {
        const dragParent = gnroGetNodeParent(this.dragNode!, nodes);
        if (target.id !== dragParent?.id) {
          this.dropInfo = {
            ...this.dropInfo!,
            targetParent: target,
            targetIndex: 0,
            position: 'inside',
          };
        }
      }
      if (this.dropInfo.position) {
        this.showDragInfo();
      } else {
        this.clearDragInfo();
        this.dropInfo = null;
      }
    }
  }

  private isDroppablePosition(target: GnroTreeNode<T>, position: string, nodes: GnroTreeNode<T>[]): boolean {
    let targetIndex = nodes.indexOf(target);
    let dragIndex = nodes.indexOf(this.dragNode!);
    const targetParent = gnroGetNodeParent(target, nodes);
    const dragParent = gnroGetNodeParent(this.dragNode!, nodes);
    let parentNodes = targetParent?.children;
    if (targetParent == undefined) {
      parentNodes = nodes.filter((node) => node.level === 0);
    }
    targetIndex = parentNodes?.findIndex((node) => node.id === target.id)!;
    if (position === 'before') {
      targetIndex--;
    } else if (position === 'after') {
      targetIndex++;
    }

    this.dropInfo = {
      ...this.dropInfo!,
      targetParent,
      targetIndex: targetIndex < 0 ? 0 : targetIndex,
    };

    if ((targetParent == undefined && dragParent === undefined) || targetParent?.id === dragParent?.id) {
      dragIndex = parentNodes?.findIndex((node) => node.id === this.dragNode!.id)!;
      return dragIndex !== targetIndex;
    }
    return true;
  }

  private isNodeDroppable(target: GnroTreeNode<T>, nodes: GnroTreeNode<T>[]): boolean {
    return target.id !== this.dragNode?.id && !this.dragNodeHasSameParent(target, this.dragNode!, nodes);
  }

  private dragNodeHasSameParent<T>(
    target: GnroTreeNode<T>,
    dragNode: GnroTreeNode<T>,
    nodes: GnroTreeNode<T>[],
  ): boolean {
    const targetParent = gnroGetNodeParent(target, nodes);
    if (targetParent?.id === this.dragNode?.id) {
      return true;
    }
    return targetParent ? this.dragNodeHasSameParent(targetParent, dragNode, nodes) : false;
  }

  private showDragInfo(): void {
    this.clearDragInfo();
    if (this.dropInfo?.target.id) {
      this.document.getElementById(this.dropInfo.target.id)?.classList.add('gnro-tree-drop-' + this.dropInfo.position);
    }
  }

  private clearDragInfo(dropped: boolean = false): void {
    if (dropped) {
      this.dropInfo = null;
      this.dragNode = null;
    }
    this.document
      .querySelectorAll('.gnro-tree-drop-before')
      .forEach((element) => element.classList.remove('gnro-tree-drop-before'));
    this.document
      .querySelectorAll('.gnro-tree-drop-after')
      .forEach((element) => element.classList.remove('gnro-tree-drop-after'));
    this.document
      .querySelectorAll('.gnro-tree-drop-inside')
      .forEach((element) => element.classList.remove('gnro-tree-drop-inside'));
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (this.dropInfo && this.dragNode) {
      this.treeFacade.dropNode(
        this.gridSetting().gridId,
        this.treeConfig(),
        this.dragNode,
        this.dropInfo.targetParent!,
        this.dropInfo.targetIndex!,
      );
    }
    this.clearDragInfo(true);
  }

  onRowSelectAll(allSelected: boolean): void {
    this.treeFacade.setSelectAllRows(this.gridSetting().gridId, !allSelected);
  }

  rowClick(event: MouseEvent, rowIndex: number, record: object): void {
    if (this.treeConfig().rowSelection) {
      if (this.prevRowIndex < 0) {
        this.prevRowIndex = rowIndex;
      }
      const selected = this.rowSelection().selection.isSelected(record as object);
      if (this.treeConfig().multiRowSelection) {
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
            this.treeFacade.setSelectAllRows(this.gridSetting().gridId, false);
          } else {
            this.treeFacade.setSelectRow(this.gridSetting().gridId, record as object);
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
      return [...this.treeData()].slice(rowIndex, prevRowIndex);
    } else {
      return [...this.treeData()].slice(prevRowIndex, rowIndex + 1);
    }
  }

  private selectRecord(record: object[], isSelected: boolean): void {
    const selected = this.getSelectedTotal(record, isSelected);
    this.treeFacade.setSelectRows(this.gridSetting().gridId, record as object[], isSelected, selected);
  }

  private getSelectedTotal(record: object[], isSelected: boolean): number {
    if (this.treeConfig().multiRowSelection) {
      const prevSelectedLength = this.rowSelection().selection.selected.length;
      if (isSelected) {
        const preSelected = record.filter((item) => this.rowSelection().selection.isSelected(item));
        return prevSelectedLength - preSelected.length + record.length;
      } else {
        return prevSelectedLength - record.length;
      }
    } else {
      return isSelected ? 1 : 0;
    }
  }

  /*
  rowDblClick(record: object): void {
    if (this.treeConfig().hasDetailView) {
      this.gridFacade.rowDblClick(this.gridSetting().gridId, record as object);
    }
  }*/

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    this.sizeChanged$.next(event);
  }
}
