import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, input } from '@angular/core';
import { GnroColumnConfig, GnroGridSetting } from '@gnro/ui/grid';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroTreeFacade } from '../../../+state/tree.facade';
import { GnroTreeConfig, GnroTreeNode } from '../../../models/tree-grid.model';

@Component({
  selector: 'gnro-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroIconModule],
})
export class GnroTreeNodeComponent<T> {
  private readonly treeFacade = inject(GnroTreeFacade);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  gridSetting = input.required<GnroGridSetting>();
  treeConfig = input.required<GnroTreeConfig>();
  column = input.required<GnroColumnConfig>();
  node = input.required({
    transform: (node: GnroTreeNode<T>) => {
      this.changeDetectorRef.markForCheck();
      return node;
    },
  });

  get data(): T {
    const record = this.node() as T;
    return (record as { [index: string]: T })[this.column().name];
  }

  @HostListener('click', ['$event']) nodeToggle(event: MouseEvent): void {
    if (!this.node().leaf) {
      event.stopPropagation();
      this.treeFacade.nodeToggle(this.gridSetting().gridId, this.treeConfig(), this.node());
    }
  }
}
