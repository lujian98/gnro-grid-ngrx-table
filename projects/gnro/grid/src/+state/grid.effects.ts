import { Injectable, inject } from '@angular/core';
import { formWindowActions } from '@gnro/ui/form-window';
import { remoteDeleteActions } from '@gnro/ui/remote';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, debounceTime, map, mergeMap, switchMap } from 'rxjs';
import { GnroColumnConfig, GnroGridConfig } from '../models/grid.model';
import { GnroGridinMemoryService } from '../services/grid-in-memory.service';
import { GnroGridService } from '../services/grid.service';
import { gridActions } from './grid.actions';
import { GnroGridFacade } from './grid.facade';

@Injectable()
export class GnroGridEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly gridService = inject(GnroGridService);
  private readonly gridinMemoryService = inject(GnroGridinMemoryService);

  setupGridConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.loadConfig),
      concatMap((action) => {
        return this.gridService.getGridConfig(action.gridConfig).pipe(
          map((gridConfig) => {
            const gridName = action.gridName;
            if (gridConfig.remoteColumnsConfig) {
              this.store.dispatch(gridActions.loadConfigSuccess({ gridName, gridConfig }));
              return gridActions.loadColumnsConfig({ gridName });
            } else {
              if (gridConfig.rowGroupField) {
                this.gridFacade.initRowGroup(gridName, gridConfig);
              } else {
                window.dispatchEvent(new Event('resize'));
              }
              return gridActions.loadConfigSuccess({ gridName, gridConfig });
            }
          }),
        );
      }),
    ),
  );

  loadGridColumnsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.loadColumnsConfig),
      concatMap((action) => {
        const gridName = action.gridName;
        const gridSetting = this.gridFacade.getSetting(gridName)();
        const gridConfig = this.gridFacade.getConfig(gridName)();
        return this.gridService.getGridColumnsConfig(gridConfig).pipe(
          map((columnsConfig) => {
            const isTreeGrid = gridSetting.isTreeGrid;
            if (gridConfig.rowGroupField) {
              this.gridFacade.initRowGroup(gridName, gridConfig);
              return gridActions.loadColumnsConfigSuccess({ gridName, gridConfig, isTreeGrid, columnsConfig });
            } else if (gridConfig.remoteGridConfig || gridSetting.isTreeGrid) {
              // remote config will need trigger window resize to load data
              window.dispatchEvent(new Event('resize'));
              return gridActions.loadColumnsConfigSuccess({ gridName, gridConfig, isTreeGrid, columnsConfig });
            } else if (!gridSetting.isTreeGrid) {
              this.store.dispatch(
                gridActions.loadColumnsConfigSuccess({ gridName, gridConfig, isTreeGrid, columnsConfig }),
              );
              return gridActions.getConcatData({ gridName });
            } else {
              // TODO tree need load local data?
              return gridActions.loadColumnsConfigSuccess({ gridName, gridConfig, isTreeGrid, columnsConfig });
            }
          }),
        );
      }),
    ),
  );

  getGridData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.getData),
      //debounceTime(10), // debounce with switchMap may lose data if two or more grid pull, but will cancel previous call
      switchMap((action) => {
        const gridName = action.gridName;
        const gridConfig = this.gridFacade.getConfig(gridName)();
        const columns = this.gridFacade.getColumnsConfig(gridName)();
        const inMemoryData = this.gridFacade.getInMemoryData(gridName)();
        return this.getGridData(action.gridName, gridConfig, columns, inMemoryData);
      }),
    ),
  );

  getConcatGridData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.getConcatData),
      mergeMap((action) => {
        const gridName = action.gridName;
        const gridConfig = this.gridFacade.getConfig(gridName)();
        const columns = this.gridFacade.getColumnsConfig(gridName)();
        const inMemoryData = this.gridFacade.getInMemoryData(gridName)();
        return this.getGridData(action.gridName, gridConfig, columns, inMemoryData);
      }),
    ),
  );

  private getGridData = <T>(
    gridName: string,
    gridConfig: GnroGridConfig,
    columns: GnroColumnConfig[],
    inMemoryData: T[],
  ) => {
    if (gridConfig.remoteGridData) {
      return this.gridService.getGridData(gridConfig, columns).pipe(
        map((gridData) => {
          return gridActions.getDataSuccess({ gridName, gridData });
        }),
      );
    } else {
      return this.gridinMemoryService.getGridData(gridConfig, columns, inMemoryData).pipe(
        map((gridData) => {
          return gridActions.getDataSuccess({ gridName, gridData });
        }),
      );
    }
  };

  saveGridModifiedRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.saveModifiedRecords),
      concatMap((action) => {
        const gridName = action.gridName;
        const gridConfig = this.gridFacade.getConfig(gridName)();
        const modifiedRecords = this.gridFacade.getModifiedRecords(gridName)();
        return this.gridService.saveModifiedRecords(gridConfig, modifiedRecords).pipe(
          map((newRecords) => {
            const gridName = action.gridName;
            return gridActions.saveModifiedRecordsSuccess({ gridName, newRecords });
          }),
        );
      }),
    ),
  );

  refreshGridData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(formWindowActions.saveSuccess, remoteDeleteActions.deleteSelectedSuccess),
      map(({ stateId }) => {
        return gridActions.getData({ gridName: stateId });
      }),
    ),
  );

  saveGridConfigs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.saveConfigs),
      concatMap((action) => {
        const gridName = action.gridName;
        const gridConfig = this.gridFacade.getConfig(gridName)();
        const columnsConfig = this.gridFacade.getColumnsConfig(gridName)();
        return this.gridService.saveGridConfigs(gridConfig, columnsConfig).pipe(
          map(() => {
            return gridActions.saveConfigsSuccess({ gridName });
          }),
        );
      }),
    ),
  );

  clearGridDataStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.clearStore),
      concatMap((action) => {
        const gridName = action.gridName;
        const gridConfig = this.gridFacade.getConfig(gridName)();
        const columnsConfig = this.gridFacade.getColumnsConfig(gridName)();
        return this.gridService
          .saveGridConfigs(gridConfig, columnsConfig)
          .pipe(map(() => gridActions.removeStore({ gridName })));
      }),
    ),
  );
}
