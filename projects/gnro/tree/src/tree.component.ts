import { ChangeDetectionStrategy, Component, inject, input, OnDestroy } from '@angular/core';
import { GnroButtonConfg, GnroBUTTONS, GnroButtonType, uniqueId } from '@gnro/ui/core';
import { GnroColumnConfig, GnroGridFacade, GnroGridStateModule } from '@gnro/ui/grid';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutComponent, GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { GnroSpinnerDirective } from '@gnro/ui/spinner';
import { GnroTreeStateModule } from './+state/tree-state.module';
import { GnroTreeFacade } from './+state/tree.facade';
import { GnroTreeViewComponent } from './components/tree-view.component';
import { defaultTreeConfig, defaultTreeSetting, GnroTreeConfig, GnroTreeNode } from './models/tree-grid.model';

@Component({
  selector: 'gnro-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GnroIconModule,
    GnroTreeStateModule,
    GnroGridStateModule,
    GnroTreeViewComponent,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    GnroSpinnerDirective,
  ],
})
export class GnroTreeComponent<T> implements OnDestroy {
  private readonly treeFacade = inject(GnroTreeFacade);
  private readonly gridFacade = inject(GnroGridFacade);
  private treeId = `tree-${uniqueId()}`;
  treeConfig$ = this.gridFacade.getConfig(this.treeId);
  gridSetting$ = this.gridFacade.getSetting(this.treeId); // Only support gridSetting for now
  columnsConfig$ = this.gridFacade.getColumnsConfig(this.treeId);
  treeData$ = this.treeFacade.getTreeSignalData(this.treeId);
  rowSelection$ = this.treeFacade.getRowSelection(this.treeId);

  buttons: GnroButtonConfg[] = [
    GnroBUTTONS.Refresh,
    GnroBUTTONS.ClearAllFilters,
    GnroBUTTONS.ExpandAll,
    GnroBUTTONS.CollapseAll,
  ];

  treeConfig = input(defaultTreeConfig, {
    transform: (value: Partial<GnroTreeConfig>) => {
      const treeConfig = { ...defaultTreeConfig, ...value };
      this.initGridConfig(treeConfig);
      return treeConfig;
    },
  });
  columnsConfig = input([], {
    transform: (columnsConfig: GnroColumnConfig[]) => {
      if (!this.treeConfig$().remoteColumnsConfig && columnsConfig.length > 0) {
        const treeSetting = { ...defaultTreeSetting, gridId: this.treeId };
        this.gridFacade.setColumnsConfig(this.treeConfig$(), treeSetting, columnsConfig);
      }
      return columnsConfig;
    },
  });
  treeData = input(undefined, {
    transform: (treeData: GnroTreeNode<T>[]) => {
      if (!this.treeConfig$().remoteGridData && treeData) {
        this.treeFacade.setTreeInMemoryData(this.treeId, this.treeConfig$(), treeData);
      }
      return treeData;
    },
  });

  constructor() {
    this.initGridConfig({ ...defaultTreeConfig });
  }

  private initGridConfig(treeConfig: GnroTreeConfig): void {
    this.gridFacade.initConfig(this.treeId, treeConfig, 'treeGrid');
    this.treeFacade.initTreeConfig(this.treeId, treeConfig);
  }

  buttonClick(button: GnroButtonConfg): void {
    switch (button.name) {
      case GnroButtonType.Refresh:
        this.treeFacade.getTreeData(this.treeId, this.treeConfig$());
        break;
      case GnroButtonType.ClearAllFilters:
        this.gridFacade.setColumnFilters(this.treeConfig$(), this.gridSetting$(), []);
        break;

      case GnroButtonType.ExpandAll:
        this.treeFacade.expandAllNodes(this.treeId, this.treeConfig$(), true);
        break;
      case GnroButtonType.CollapseAll:
        this.treeFacade.expandAllNodes(this.treeId, this.treeConfig$(), false);
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.gridFacade.clearStore(this.treeId);
    this.treeFacade.clearTreeDataStore(this.treeId);
  }
}
