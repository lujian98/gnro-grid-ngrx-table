import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GnroColumnConfig, GnroGridFacade, GnroGridStateModule, GnroGridSetting } from '@gnro/ui/grid';
import * as treeActions from './tree.actions';
import { selectTreeData, selectTreeInMemoryData } from './tree.selectors';
import { GnroTreeConfig, GnroTreeNode } from '../models/tree-grid.model';

@Injectable()
export class GnroTreeFacade {
  private store = inject(Store);
  private gridFacade = inject(GnroGridFacade);

  initTreeConfig(treeId: string, treeConfig: GnroTreeConfig): void {
    this.store.dispatch(treeActions.initTreeConfig({ treeId, treeConfig }));
  }

  viewportReadyLoadData(treeId: string, treeConfig: GnroTreeConfig, gridSetting: GnroGridSetting): void {
    if (gridSetting.viewportReady) {
      this.gridFacade.setLoadTreeDataLoading(treeId, true);
      this.getTreeData(treeId, treeConfig);
    }
  }

  windowResizeLoadData(treeId: string, treeConfig: GnroTreeConfig, gridSetting: GnroGridSetting): void {
    if (gridSetting.viewportReady) {
      this.gridFacade.setLoadTreeDataLoading(treeId, true);
      this.store.dispatch(treeActions.getConcatTreeData({ treeId, treeConfig }));
    }
  }

  getTreeData(treeId: string, treeConfig: GnroTreeConfig): void {
    this.gridFacade.setLoadTreeDataLoading(treeId, true);
    if (treeConfig.remoteGridData) {
      this.store.dispatch(treeActions.getTreeRemoteData({ treeId, treeConfig }));
    } else {
      this.store.dispatch(treeActions.getTreeInMemoryData({ treeId, treeConfig }));
    }
  }

  nodeToggle<T>(treeId: string, treeConfig: GnroTreeConfig, node: GnroTreeNode<T>): void {
    if (treeConfig.remoteGridData && !treeConfig.remoteLoadAll) {
      // TODO remove data need call a service to add/remove child
    } else {
      this.store.dispatch(treeActions.nodeToggleInMemoryData({ treeId, treeConfig, node }));
      this.gridFacade.setLoadTreeDataLoading(treeId, true);
      this.store.dispatch(treeActions.getTreeInMemoryData({ treeId, treeConfig }));
    }
  }

  expandAllNodes<T>(treeId: string, treeConfig: GnroTreeConfig, expanded: boolean): void {
    if (treeConfig.remoteGridData && !treeConfig.remoteLoadAll) {
      // TODO remove data need call a service to add/remove child
    } else {
      this.store.dispatch(treeActions.expandAllNodesInMemoryData({ treeId, treeConfig, expanded }));
      this.gridFacade.setLoadTreeDataLoading(treeId, true);
      this.store.dispatch(treeActions.getTreeInMemoryData({ treeId, treeConfig }));
    }
  }

  dropNode<T>(
    treeId: string,
    treeConfig: GnroTreeConfig,
    node: GnroTreeNode<T>,
    targetParent: GnroTreeNode<T>,
    targetIndex: number,
  ): void {
    this.store.dispatch(treeActions.dropNode({ treeId, treeConfig, node, targetParent, targetIndex }));
    this.store.dispatch(treeActions.getTreeInMemoryData({ treeId, treeConfig }));
    //TODO remote update node
  }

  setTreeInMemoryData<T>(treeId: string, treeConfig: GnroTreeConfig, treeData: GnroTreeNode<T>[]): void {
    this.store.dispatch(treeActions.setTreeInMemoryData({ treeId, treeConfig, treeData }));
  }

  clearTreeDataStore(treeId: string): void {
    this.store.dispatch(treeActions.clearTreeDataStore({ treeId }));
  }

  getTreeSignalData<T>(treeId: string): Signal<GnroTreeNode<T>[]> {
    return this.store.selectSignal(selectTreeData(treeId));
  }

  selectTreeInMemoryData<T>(treeId: string): Observable<GnroTreeNode<T>[]> {
    return this.store.select(selectTreeInMemoryData(treeId));
  }
}
