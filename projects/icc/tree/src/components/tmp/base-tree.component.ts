import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, ViewChild, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { delay, takeWhile } from 'rxjs/operators';
//import { IccDataSource } from '../datasource/datasource';
//import { IccTableEventService } from '../table/services/table-event.service';
import { DropInfo } from './tree-model'; // IccTableConfigs
//import { IccField } from '../items';

@Component({
  template: '',
})
export class IccBaseTreeComponent<T> implements OnInit, OnDestroy {
  @Input() data: T[] = [];
  @Input() tableConfigs: any; //IccTableConfigs;
  columns: any[] = []; // IccField[] = [];

  private alive = true;
  //protected tableEventService: IccTableEventService;

  nodeId!: number; // TODO global unique node id????

  dataSource: any; //IccDataSource<T>;
  dataSourceLength = 0;

  treeColumn: any;
  visibleColumns: any[] = []; //IccField[] = [];
  displayedColumns: string[] = [];

  isViewportReady = false;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  @Output() iccViewportEvent: EventEmitter<CdkVirtualScrollViewport> = new EventEmitter<CdkVirtualScrollViewport>();

  document: any;
  dragNode!: T | null;
  nodeLookup: any = {};
  dropInfo: DropInfo | null = null;

  get tableWidth(): number {
    return this.visibleColumns.map((column) => column.width).reduce((prev, curr) => prev + curr, 0);
  }

  ngOnInit() {}

  protected setTreeColumns() {
    if (this.columns.length) {
      this.treeColumn = this.columns[0];
    }
    this.visibleColumns = this.columns;
    this.displayedColumns = this.visibleColumns.map((column) => column.name);
    /*
    this.tableEventService.tableEvent$.pipe(takeWhile(() => this.alive), delay(10))
      .subscribe((e: any) => {
        if (e.event) {
          if (e.event.menuItem) {
            const field = e.event.menuItem.field;
            if (field.name === 'expandAll') {
              this.expandAll();
            } else if (field.name === 'collapseAll') {
              this.collapseAll();
            }
          }
        }
      });*/
  }

  nextBatch(event: any) {
    if (!this.isViewportReady) {
      this.isViewportReady = true;
      this.iccViewportEvent.emit(this.viewport);
      // this.dataSource = new IccDataSource(this.viewport); // TODO
      this.setTreeData();
    }
    const treeRows = this.viewport.elementRef.nativeElement.getElementsByTagName('cdk-nested-tree-node');
    console.log(
      ' next batch ange changesevent treeRows.length=',
      treeRows.length,
      ' data length =',
      this.dataSourceLength,
    );
  }

  protected setTreeData() {}

  expandAll() {}

  collapseAll() {}

  dragStart(node: T) {
    this.dragNode = node;
  }

  dragMoved(event: any) {
    // console.log('drag moved=', event);
    this.dropInfo = null;
    const e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
    if (!e) {
      this.clearDragInfo();
      return;
    }
    const container = e.classList.contains('icc-tree-node') ? e : e.closest('.icc-tree-node');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    const targetId = container.getAttribute('tree-node-id');
    if (this.isNodeDroppable(targetId)) {
      this.dropInfo = {
        targetId: targetId,
      };
      const targetRect = container.getBoundingClientRect();
      const oneThird = targetRect.height / 3;
      if (event.pointerPosition.y - targetRect.top < oneThird && this.isDroppablePosition(targetId, 'before')) {
        this.dropInfo.position = 'before';
      } else if (
        event.pointerPosition.y - targetRect.top > 2 * oneThird &&
        this.isDroppablePosition(targetId, 'after')
      ) {
        this.dropInfo.position = 'after';
      } else {
        const dragParentId = this.getParentNodeId(this.dragNode!, this.data, 'main');
        if (targetId !== dragParentId) {
          this.dropInfo.position = 'inside';
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

  drop(event: CdkDragDrop<string[]>) {
    this.dataSource.data = []; // sometime even is not dropable, the tree will rearrange, bug???
    this.setTreeData();
    this.clearDragInfo(true);
  }

  protected isDroppablePosition(targetId: string, posiiton: string): boolean {
    return false;
  }

  protected isNodeDroppable(targetId: string): boolean {
    return false;
  }

  protected getParentNodeId(node: T, nodes: T[], parentId: string): string | null {
    return null;
  }

  protected showDragInfo() {
    this.clearDragInfo();
    if (this.dropInfo && this.dropInfo.targetId) {
      this.document.getElementById(this.dropInfo.targetId).classList.add('icc-tree-drop-' + this.dropInfo.position);
    }
  }

  protected clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropInfo = null;
      this.dragNode = null;
    }
    this.document
      .querySelectorAll('.icc-tree-drop-before')
      .forEach((element: any) => element.classList.remove('icc-tree-drop-before'));
    this.document
      .querySelectorAll('.icc-tree-drop-after')
      .forEach((element: any) => element.classList.remove('icc-tree-drop-after'));
    this.document
      .querySelectorAll('.icc-tree-drop-inside')
      .forEach((element: any) => element.classList.remove('icc-tree-drop-inside'));
  }

  onViewportScroll(event: any) {
    this.tableConfigs.columnHeaderPosition = -event.target.scrollLeft;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
