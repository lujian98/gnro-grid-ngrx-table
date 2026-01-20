import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy } from '@angular/core';
import { GnroButtonConfg, GnroBUTTONS, GnroButtonType } from '@gnro/ui/core';
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

  // Computed signals based on gridName from treeConfig
  treeConfig$ = computed(() => this.gridFacade.getConfig(this.treeConfig().gridName)());
  gridSetting$ = computed(() => this.gridFacade.getSetting(this.treeConfig().gridName)());
  columnsConfig$ = computed(() => this.gridFacade.getColumnsConfig(this.treeConfig().gridName)());
  treeData$ = computed(() => this.treeFacade.getSignalData(this.treeConfig().gridName)());
  rowSelection$ = computed(() => this.treeFacade.getRowSelection(this.treeConfig().gridName)());

  buttons: GnroButtonConfg[] = [
    GnroBUTTONS.Refresh,
    GnroBUTTONS.ClearAllFilters,
    GnroBUTTONS.ExpandAll,
    GnroBUTTONS.CollapseAll,
  ];

  treeConfig = input(defaultTreeConfig, {
    transform: (value: Partial<GnroTreeConfig>) => {
      const treeConfig = { ...defaultTreeConfig, ...value };
      this.initTreeConfig(treeConfig);
      return treeConfig;
    },
  });
  columnsConfig = input([], {
    transform: (columnsConfig: GnroColumnConfig[]) => {
      if (!this.treeConfig$().remoteColumnsConfig && columnsConfig.length > 0) {
        const treeSetting = { ...defaultTreeSetting, gridId: this.treeConfig().gridName };
        this.gridFacade.setColumnsConfig(this.treeConfig$(), treeSetting, columnsConfig);
      }
      return columnsConfig;
    },
  });
  treeData = input(undefined, {
    transform: (treeData: GnroTreeNode<T>[]) => {
      if (!this.treeConfig$().remoteGridData && treeData) {
        this.treeFacade.setInMemoryData(this.treeConfig().gridName, this.treeConfig$(), treeData);
      }
      return treeData;
    },
  });

  constructor() {
    this.initTreeConfig({ ...defaultTreeConfig });
  }

  private initTreeConfig(config: GnroTreeConfig): void {
    const treeConfig = { ...config, urlKey: config.urlKey ? config.urlKey : config.gridName };
    this.gridFacade.initConfig(treeConfig.gridName, treeConfig, 'treeGrid');
    this.treeFacade.initConfig(treeConfig.gridName, treeConfig);
  }

  buttonClick(button: GnroButtonConfg): void {
    switch (button.name) {
      case GnroButtonType.Refresh:
        this.treeFacade.getData(this.treeConfig().gridName, this.treeConfig$());
        break;
      case GnroButtonType.ClearAllFilters:
        this.gridFacade.setColumnFilters(this.treeConfig$(), this.gridSetting$(), []);
        break;
      case GnroButtonType.ExpandAll:
        this.treeFacade.expandAllNodes(this.treeConfig().gridName, this.treeConfig$(), true);
        break;
      case GnroButtonType.CollapseAll:
        this.treeFacade.expandAllNodes(this.treeConfig().gridName, this.treeConfig$(), false);
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.gridFacade.clearStore(this.treeConfig().gridName);
    this.treeFacade.clearStore(this.treeConfig().gridName);
  }
}
