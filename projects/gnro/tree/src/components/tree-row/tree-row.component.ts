import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridCellComponent,
  GnroGridCellViewComponent,
  GnroGridSetting,
  GnroRowSelectComponent,
  ROW_SELECTION_CELL_WIDTH,
} from '@gnro/ui/grid';
import { GnroTreeConfig, GnroTreeNode } from '../../models/tree-grid.model';
import { GnroTreeNodeComponent } from './tree-node/tree-node.component';

@Component({
  selector: 'gnro-tree-row',
  templateUrl: './tree-row.component.html',
  styleUrls: ['./tree-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTreeNodeComponent, GnroGridCellComponent, GnroGridCellViewComponent, GnroRowSelectComponent],
})
export class GnroTreeRowComponent<T> {
  columns = input.required<GnroColumnConfig[]>();
  gridSetting = input.required<GnroGridSetting>();
  treeConfig = input.required<GnroTreeConfig>();
  record = input.required<GnroTreeNode<T>>();
  //selected = input.required<boolean>();
  selected = input<boolean>(false);
  columnWidths = input.required<GnroColumnWidth[]>();
  rowIndex = input.required<number>();

  get treeColumn(): GnroColumnConfig | undefined {
    return this.columns().find((col) => col.name === 'name');
  }

  get nodePadding(): number {
    return (this.record().level! + 1) * 10;
  }

  getColumnWidth(column: GnroColumnConfig): string {
    const width = this.columnWidths().find((col) => col.name === column.name)?.width;
    return width ? `${width}px` : '';
  }

  get selectColumnWidth(): string {
    return `${ROW_SELECTION_CELL_WIDTH}px`;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
