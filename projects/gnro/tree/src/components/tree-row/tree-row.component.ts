import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  getColumnsWidth,
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
  host: {
    '[class.selected]': 'selected()',
  },
})
export class GnroTreeRowComponent<T> {
  columns = input.required<GnroColumnConfig[]>();
  gridSetting = input.required<GnroGridSetting>();
  treeConfig = input.required<GnroTreeConfig>();
  record = input.required<GnroTreeNode<T>>();
  selected = input.required<boolean>();
  columnWidths = input.required<GnroColumnWidth[]>();
  rowIndex = input.required<number>();

  get treeColumn(): GnroColumnConfig | undefined {
    return this.columns().find((col) => col.name === 'name');
  }

  get nodePadding(): number {
    return (this.record().level! + 1) * 10;
  }

  isFirstStickyEnd(index: number): boolean {
    if (this.treeConfig().columnSticky) {
      return index === [...this.columns()].findIndex((col) => col.stickyEnd);
    } else {
      return false;
    }
  }
}
