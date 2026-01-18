import { inject, Injectable, Signal } from '@angular/core';
import { GnroGridFacade, GnroGridRowSelections, GnroGridSetting } from '@gnro/ui/grid';
import { Store } from '@ngrx/store';
import { GnroTreeConfig, GnroTreeNode } from '../models/tree-grid.model';
import { GnroTreeFeatureService } from './tree-state.module';
import { treeActions } from './tree.actions';
import { createTreeSelectorsForFeature } from './tree.selectors';

@Injectable({ providedIn: 'root' })
export class GnroTreeFacade {
  private readonly store = inject(Store);
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly treeFeatureService = inject(GnroTreeFeatureService);

  initConfig(gridName: string, treeConfig: GnroTreeConfig): void {
    // Dynamically register the feature for this gridName
    this.treeFeatureService.registerFeature(gridName);
    this.store.dispatch(treeActions.initConfig({ gridName, treeConfig }));
  }

  viewportReadyLoadData(gridName: string, treeConfig: GnroTreeConfig, gridSetting: GnroGridSetting): void {
    if (gridSetting.viewportReady) {
      this.gridFacade.setLoadTreeDataLoading(gridName, true);
      this.getData(gridName, treeConfig);
    }
  }

  windowResizeLoadData(gridName: string, treeConfig: GnroTreeConfig, gridSetting: GnroGridSetting): void {
    if (gridSetting.viewportReady) {
      this.gridFacade.setLoadTreeDataLoading(gridName, true);
      this.store.dispatch(treeActions.getConcatTreeData({ gridName, treeConfig }));
    }
  }

  getData(gridName: string, treeConfig: GnroTreeConfig): void {
    this.gridFacade.setLoadTreeDataLoading(gridName, true);
    if (treeConfig.remoteGridData) {
      this.store.dispatch(treeActions.getData({ gridName, treeConfig }));
    } else {
      this.store.dispatch(treeActions.getInMemoryData({ gridName, treeConfig }));
    }
  }

  nodeToggle<T>(gridName: string, treeConfig: GnroTreeConfig, node: GnroTreeNode<T>): void {
    if (treeConfig.remoteGridData && !treeConfig.remoteLoadAll) {
      // TODO remove data need call a service to add/remove child
    } else {
      this.store.dispatch(treeActions.nodeToggleInMemoryData({ gridName, treeConfig, node }));
      this.gridFacade.setLoadTreeDataLoading(gridName, true);
      this.store.dispatch(treeActions.getInMemoryData({ gridName, treeConfig }));
    }
  }

  expandAllNodes<T>(gridName: string, treeConfig: GnroTreeConfig, expanded: boolean): void {
    if (treeConfig.remoteGridData && !treeConfig.remoteLoadAll) {
      // TODO remove data need call a service to add/remove child
    } else {
      this.store.dispatch(treeActions.expandAllNodesInMemoryData({ gridName, treeConfig, expanded }));
      this.gridFacade.setLoadTreeDataLoading(gridName, true);
      this.store.dispatch(treeActions.getInMemoryData({ gridName, treeConfig }));
    }
  }

  dropNode<T>(
    gridName: string,
    treeConfig: GnroTreeConfig,
    node: GnroTreeNode<T>,
    targetParent: GnroTreeNode<T>,
    targetIndex: number,
  ): void {
    this.store.dispatch(treeActions.dropNode({ gridName, treeConfig, node, targetParent, targetIndex }));
    this.store.dispatch(treeActions.getInMemoryData({ gridName, treeConfig }));
    //TODO remote update node
  }

  setSelectAllRows(gridName: string, selectAll: boolean): void {
    this.store.dispatch(treeActions.setSelectAllRows({ gridName, selectAll }));
  }

  setSelectRows<T>(gridName: string, records: GnroTreeNode<T>[], isSelected: boolean, selected: number): void {
    this.store.dispatch(treeActions.setSelectRows({ gridName, records, isSelected, selected }));
  }

  setSelectRow<T>(gridName: string, record: GnroTreeNode<T>): void {
    this.store.dispatch(treeActions.setSelectRow({ gridName, record }));
  }

  setInMemoryData<T>(gridName: string, treeConfig: GnroTreeConfig, treeData: GnroTreeNode<T>[]): void {
    this.store.dispatch(treeActions.setInMemoryData({ gridName, treeConfig, treeData }));
  }

  clearStore(gridName: string): void {
    this.store.dispatch(treeActions.clearStore({ gridName }));
  }

  getTreeConfig(gridName: string): Signal<GnroTreeConfig> {
    const selectors = createTreeSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectTreeConfig);
  }

  getSignalData<T>(gridName: string): Signal<GnroTreeNode<T>[]> {
    const selectors = createTreeSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectTreeData) as Signal<GnroTreeNode<T>[]>;
  }

  getInMemoryData<T>(gridName: string): Signal<GnroTreeNode<T>[]> {
    const selectors = createTreeSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectTreeInMemoryData) as Signal<GnroTreeNode<T>[]>;
  }

  getRowSelection<T>(gridName: string): Signal<GnroGridRowSelections<GnroTreeNode<T>> | undefined> {
    const selectors = createTreeSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectRowSelection) as Signal<
      GnroGridRowSelections<GnroTreeNode<T>> | undefined
    >;
  }
}
