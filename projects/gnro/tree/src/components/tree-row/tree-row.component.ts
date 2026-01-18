import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  GnroColumnConfig,
  GnroColumnWidth,
  GnroGridCellComponent,
  GnroGridCellViewComponent,
  GnroGridSetting,
  GnroRowSelectComponent,
  getTableWidth,
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
    '[style.width]': 'width$()',
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

  width$ = computed(() => {
    const tableWidth = this.treeConfig().horizontalScroll
      ? getTableWidth(this.columns(), this.treeConfig())
      : this.gridSetting().viewportWidth;
    return `${tableWidth}px`;
  });

  get treeColumn(): GnroColumnConfig | undefined {
    return this.columns().find((col) => col.name === 'name');
  }

  get nodePadding(): number {
    return (this.record().level! + 1) * 10;
  }
}
