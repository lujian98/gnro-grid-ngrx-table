import { Injectable, inject } from '@angular/core';
import { GnroGridFacade, gridActions } from '@gnro/ui/grid';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, debounceTime, delay, filter, map, mergeMap, of, switchMap } from 'rxjs';
import { GnroTreeConfig } from '../models/tree-grid.model';
import { GnroTreeinMemoryService } from '../services/tree-in-memory.service';
import { GnroTreeRemoteService } from '../services/tree-remote.service';
import * as treeActions from './tree.actions';
import { GnroTreeFacade } from './tree.facade';

@Injectable()
export class GnroTreeEffects {
  private actions$ = inject(Actions);
  private gridFacade = inject(GnroGridFacade);
  private treeFacade = inject(GnroTreeFacade);
  private treeRemoteService = inject(GnroTreeRemoteService);
  private treeinMemoryService = inject(GnroTreeinMemoryService);

  getTreeRemoteData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(treeActions.getTreeRemoteData),
      debounceTime(10), // debounce with switchMap may lose data if two or more tree pull, but will cancel previous call
      switchMap((action) => {
        const treeId = action.treeId;
        const treeConfig = this.gridFacade.getGridConfig(treeId)();
        const columns = this.gridFacade.getColumnsConfig(treeId)();
        return this.treeRemoteService.getTreeRemoteData(treeConfig, columns).pipe(
          map((treeData) => {
            this.gridFacade.setLoadTreeDataLoading(treeId, false);
            return treeActions.getTreeRemoteDataSuccess({ treeId, treeConfig, treeData });
          }),
        );
      }),
    ),
  );

  getConcatTreeData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(treeActions.getConcatTreeData),
      concatMap((action) => {
        const treeId = action.treeId;
        const treeConfig = this.gridFacade.getGridConfig(treeId)();
        const columns = this.gridFacade.getColumnsConfig(treeId)();
        const inMemoryData = this.treeFacade.getTreeInMemoryData(treeId)();
        if (treeConfig.remoteGridData) {
          return this.treeRemoteService.getTreeRemoteData(treeConfig, columns).pipe(
            map((treeData) => {
              this.gridFacade.setLoadTreeDataLoading(treeId, false);
              return treeActions.getTreeRemoteDataSuccess({ treeId, treeConfig, treeData });
            }),
          );
        } else {
          return this.treeinMemoryService.getTreeData(treeConfig, columns, inMemoryData).pipe(
            map((treeData) => {
              this.gridFacade.setLoadTreeDataLoading(treeId, false);
              return treeActions.getInMemoryTreeDataSuccess({ treeId, treeConfig, treeData });
            }),
          );
        }
      }),
    ),
  );

  // for remoteLoadAll not refresh and in memory data
  getTreeInMemoryData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(treeActions.getTreeInMemoryData),
      debounceTime(10), // debounce with switchMap may lose data if two or more tree pull, but will cancel previous call
      switchMap((action) => {
        const treeId = action.treeId;
        const treeConfig = this.gridFacade.getGridConfig(treeId)();
        const columns = this.gridFacade.getColumnsConfig(treeId)();
        const inMemoryData = this.treeFacade.getTreeInMemoryData(treeId)();
        return this.treeinMemoryService.getTreeData(treeConfig, columns, inMemoryData).pipe(
          map((treeData) => {
            this.gridFacade.setLoadTreeDataLoading(treeId, false);
            return treeActions.getInMemoryTreeDataSuccess({ treeId, treeConfig, treeData });
          }),
        );
      }),
    ),
  );

  setGridColumnFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.setGridColumnFilters, gridActions.loadGridColumnsConfigSuccess), // gridActions
      switchMap(({ gridId, gridConfig, isTreeGrid }) =>
        of({ gridId, gridConfig, isTreeGrid }).pipe(
          filter(({ isTreeGrid }) => isTreeGrid),
          map(({ gridId, gridConfig }) => {
            const treeId = gridId;
            const treeConfig = gridConfig as GnroTreeConfig;
            if (gridConfig.remoteGridData && !treeConfig.remoteLoadAll) {
              return treeActions.getTreeRemoteData({ treeId, treeConfig });
            } else {
              return treeActions.getTreeInMemoryData({ treeId, treeConfig });
            }
          }),
        ),
      ),
    ),
  );

  setGridSortFields$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.setGridSortFields), // gridActions
      switchMap(({ gridId, gridConfig, isTreeGrid }) =>
        of({ gridId, gridConfig, isTreeGrid }).pipe(
          filter(({ isTreeGrid }) => isTreeGrid),
          map(({ gridId, gridConfig }) => {
            const treeId = gridId;
            const treeConfig = gridConfig as GnroTreeConfig;
            if (treeConfig.remoteGridData && !treeConfig.remoteLoadAll) {
              return treeActions.getTreeRemoteData({ treeId, treeConfig });
            } else {
              return treeActions.getTreeInMemoryData({ treeId, treeConfig });
            }
          }),
        ),
      ),
    ),
  );

  clearTreeDataStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(treeActions.clearTreeDataStore),
      delay(250), // wait 250 after destory the component to clear data store
      mergeMap(({ treeId }) => of(treeId).pipe(map((treeId) => treeActions.removeTreeDataStore({ treeId })))),
    ),
  );
}
