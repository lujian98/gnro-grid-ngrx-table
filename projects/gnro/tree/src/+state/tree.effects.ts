import { Injectable, inject } from '@angular/core';
import { GnroGridFacade, gridActions } from '@gnro/ui/grid';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, filter, map, of, switchMap } from 'rxjs';
import { GnroTreeConfig } from '../models/tree-grid.model';
import { GnroTreeinMemoryService } from '../services/tree-in-memory.service';
import { GnroTreeRemoteService } from '../services/tree-remote.service';
import { treeActions } from './tree.actions';
import { GnroTreeFacade } from './tree.facade';

@Injectable()
export class GnroTreeEffects {
  private readonly actions$ = inject(Actions);
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly treeFacade = inject(GnroTreeFacade);
  private readonly treeRemoteService = inject(GnroTreeRemoteService);
  private readonly treeinMemoryService = inject(GnroTreeinMemoryService);

  getTreeRemoteData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(treeActions.getData),
      switchMap((action) => {
        const gridName = action.gridName;
        const treeConfig = this.gridFacade.getConfig(gridName)();
        const columns = this.gridFacade.getColumnsConfig(gridName)();
        return this.treeRemoteService.getTreeRemoteData(treeConfig, columns).pipe(
          map((treeData) => {
            this.gridFacade.setLoadTreeDataLoading(gridName, false);
            return treeActions.getDataSuccess({ gridName, treeConfig, treeData });
          }),
        );
      }),
    ),
  );

  getConcatTreeData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(treeActions.getConcatTreeData),
      concatMap((action) => {
        const gridName = action.gridName;
        const treeConfig = this.gridFacade.getConfig(gridName)();
        const columns = this.gridFacade.getColumnsConfig(gridName)();
        const inMemoryData = this.treeFacade.getInMemoryData(gridName)();
        if (treeConfig.remoteGridData) {
          return this.treeRemoteService.getTreeRemoteData(treeConfig, columns).pipe(
            map((treeData) => {
              this.gridFacade.setLoadTreeDataLoading(gridName, false);
              return treeActions.getDataSuccess({ gridName, treeConfig, treeData });
            }),
          );
        } else {
          return this.treeinMemoryService.getTreeData(treeConfig, columns, inMemoryData).pipe(
            map((treeData) => {
              this.gridFacade.setLoadTreeDataLoading(gridName, false);
              return treeActions.getInMemoryDataSuccess({ gridName, treeConfig, treeData });
            }),
          );
        }
      }),
    ),
  );

  // for remoteLoadAll not refresh and in memory data
  getTreeInMemoryData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(treeActions.getInMemoryData),
      switchMap((action) => {
        const gridName = action.gridName;
        const treeConfig = this.gridFacade.getConfig(gridName)();
        const columns = this.gridFacade.getColumnsConfig(gridName)();
        const inMemoryData = this.treeFacade.getInMemoryData(gridName)();
        return this.treeinMemoryService.getTreeData(treeConfig, columns, inMemoryData).pipe(
          map((treeData) => {
            this.gridFacade.setLoadTreeDataLoading(gridName, false);
            return treeActions.getInMemoryDataSuccess({ gridName, treeConfig, treeData });
          }),
        );
      }),
    ),
  );

  setGridColumnFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.setColumnFilters, gridActions.loadColumnsConfigSuccess), // gridActions
      switchMap(({ gridId, gridConfig, isTreeGrid }) =>
        of({ gridId, gridConfig, isTreeGrid }).pipe(
          filter(({ isTreeGrid }) => isTreeGrid),
          map(({ gridId, gridConfig }) => {
            const gridName = gridId;
            const treeConfig = gridConfig as GnroTreeConfig;
            if (gridConfig.remoteGridData && !treeConfig.remoteLoadAll) {
              return treeActions.getData({ gridName, treeConfig });
            } else {
              return treeActions.getInMemoryData({ gridName, treeConfig });
            }
          }),
        ),
      ),
    ),
  );

  setGridSortFields$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.setSortFields), // gridActions
      switchMap(({ gridId, gridConfig, isTreeGrid }) =>
        of({ gridId, gridConfig, isTreeGrid }).pipe(
          filter(({ isTreeGrid }) => isTreeGrid),
          map(({ gridId, gridConfig }) => {
            const gridName = gridId;
            const treeConfig = gridConfig as GnroTreeConfig;
            if (treeConfig.remoteGridData && !treeConfig.remoteLoadAll) {
              return treeActions.getData({ gridName, treeConfig });
            } else {
              return treeActions.getInMemoryData({ gridName, treeConfig });
            }
          }),
        ),
      ),
    ),
  );

  clearTreeDataStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(treeActions.clearStore),
      map(({ gridName }) => treeActions.removeStore({ gridName })),
    ),
  );
}
