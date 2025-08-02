import { Injectable, inject } from '@angular/core';
import { GnroBackendService } from '@gnro/ui/core';
import { savedFormWindowDataAction } from '@gnro/ui/form-window';
import { deleteSelectedSucessfulAction } from '@gnro/ui/remote';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, debounceTime, delay, exhaustMap, map, mergeMap, of, switchMap } from 'rxjs';
import { GnroColumnConfig, GnroGridConfig } from '../models/grid.model';
import { GnroGridinMemoryService } from '../services/grid-in-memory.service';
import { GnroGridService } from '../services/grid.service';
import { filterHttpParams } from '../utils/filter-http-params';
import { sortHttpParams } from '../utils/sort-http-params';
import * as gridActions from './grid.actions';
import { GnroGridFacade } from './grid.facade';

@Injectable()
export class GnroGridEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly gridService = inject(GnroGridService);
  private readonly gridinMemoryService = inject(GnroGridinMemoryService);
  private readonly backendService = inject(GnroBackendService);

  setupGridConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.loadGridConfig),
      concatMap((action) => {
        return this.gridService.getGridConfig(action.gridConfig).pipe(
          map((gridConfig) => {
            const gridId = action.gridId;
            if (gridConfig.remoteColumnsConfig) {
              this.store.dispatch(gridActions.loadGridConfigSuccess({ gridId, gridConfig }));
              return gridActions.loadGridColumnsConfig({ gridId });
            } else {
              if (gridConfig.rowGroupField) {
                this.gridFacade.initRowGroup(gridId, gridConfig);
              } else {
                window.dispatchEvent(new Event('resize'));
              }
              return gridActions.loadGridConfigSuccess({ gridId, gridConfig });
            }
          }),
        );
      }),
    ),
  );

  loadGridColumnsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.loadGridColumnsConfig),
      concatMap((action) => {
        const gridId = action.gridId;
        const gridSetting = this.gridFacade.getSetting(gridId)();
        const gridConfig = this.gridFacade.getGridConfig(gridId)();
        return this.gridService.getGridColumnsConfig(gridConfig).pipe(
          map((columnsConfig) => {
            const isTreeGrid = gridSetting.isTreeGrid;
            if (gridConfig.rowGroupField) {
              this.gridFacade.initRowGroup(gridId, gridConfig);
              return gridActions.loadGridColumnsConfigSuccess({ gridId, gridConfig, isTreeGrid, columnsConfig });
            } else if (gridConfig.remoteGridConfig || gridSetting.isTreeGrid) {
              // remote config will need trigger window resize to load data
              window.dispatchEvent(new Event('resize'));
              return gridActions.loadGridColumnsConfigSuccess({ gridId, gridConfig, isTreeGrid, columnsConfig });
            } else if (!gridSetting.isTreeGrid) {
              this.store.dispatch(
                gridActions.loadGridColumnsConfigSuccess({ gridId, gridConfig, isTreeGrid, columnsConfig }),
              );
              return gridActions.getConcatGridData({ gridId });
            } else {
              // TODO tree need load local data?
              return gridActions.loadGridColumnsConfigSuccess({ gridId, gridConfig, isTreeGrid, columnsConfig });
            }
          }),
        );
      }),
    ),
  );

  getGridData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.getGridData),
      debounceTime(10), // debounce with switchMap may lose data if two or more grid pull, but will cancel previous call
      switchMap((action) => {
        const gridId = action.gridId;
        const gridConfig = this.gridFacade.getGridConfig(gridId)();
        const columns = this.gridFacade.getColumnsConfig(gridId)();
        const inMemoryData = this.gridFacade.getGridInMemoryData(gridId)();
        return this.getGridData(action.gridId, gridConfig, columns, inMemoryData);
      }),
    ),
  );

  getConcatGridData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.getConcatGridData),
      mergeMap((action) => {
        const gridId = action.gridId;
        const gridConfig = this.gridFacade.getGridConfig(gridId)();
        const columns = this.gridFacade.getColumnsConfig(gridId)();
        const inMemoryData = this.gridFacade.getGridInMemoryData(gridId)();
        return this.getGridData(action.gridId, gridConfig, columns, inMemoryData);
      }),
    ),
  );

  private getGridData = (
    gridId: string,
    gridConfig: GnroGridConfig,
    columns: GnroColumnConfig[],
    inMemoryData: unknown[],
  ) => {
    if (gridConfig.remoteGridData) {
      return this.gridService.getGridData(gridConfig, columns).pipe(
        map((gridData) => {
          return gridActions.getGridDataSuccess({ gridId, gridData });
        }),
      );
    } else {
      return this.gridinMemoryService.getGridData(gridConfig, columns, inMemoryData).pipe(
        map((gridData) => {
          return gridActions.getGridDataSuccess({ gridId, gridData });
        }),
      );
    }
  };

  saveGridModifiedRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.saveGridModifiedRecords),
      concatMap((action) => {
        const gridId = action.gridId;
        const gridConfig = this.gridFacade.getGridConfig(gridId)();
        const modifiedRecords = this.gridFacade.getGridModifiedRecords(gridId)();
        return this.gridService.saveModifiedRecords(gridConfig, modifiedRecords).pipe(
          map((newRecords) => {
            const gridId = action.gridId;
            return gridActions.saveModifiedRecordsSuccess({ gridId, newRecords });
          }),
        );
      }),
    ),
  );

  refreshGridData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(savedFormWindowDataAction, deleteSelectedSucessfulAction),
      map(({ stateId }) => {
        return gridActions.getGridData({ gridId: stateId });
      }),
    ),
  );

  openExportWindow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.openExportWindow),
      exhaustMap((action) => {
        const gridId = action.gridId;
        const gridConfig = this.gridFacade.getGridConfig(gridId)();
        const columns = this.gridFacade.getColumnsConfig(gridId)();

        let params = this.backendService.getParams(gridConfig.urlKey, 'export');
        params = filterHttpParams(gridConfig.columnFilters, columns, params);
        params = sortHttpParams(gridConfig.sortFields, params);
        return this.gridService.export(gridConfig, params).pipe(
          map((response) => {
            console.log(' response=', response);
            const blob = new Blob([response], { type: 'text/xls' });
            const url = window.URL.createObjectURL(blob);
            const element = document.createElement('a');
            element.download = 'download-file.xls';
            element.href = url;
            element.click();

            return gridActions.exportFileSuccess();
          }),
        );
      }),
    ),
  );

  clearGridDataStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(gridActions.clearGridDataStore),
      concatMap((action) => {
        const gridId = action.gridId;
        const gridConfig = this.gridFacade.getGridConfig(gridId)();
        const columnsConfig = this.gridFacade.getColumnsConfig(gridId)();
        return this.gridService
          .saveGridConfigs(gridConfig, columnsConfig)
          .pipe(map(() => gridActions.getGridData({ gridId: action.gridId })));
      }),
      delay(250), // wait 250 after destory the component to clear data store
      mergeMap(({ gridId }) => of(gridId).pipe(map((gridId) => gridActions.removeGridDataStore({ gridId })))),
    ),
  );
}
