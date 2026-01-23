import { inject, Injectable, Signal } from '@angular/core';
import { GnroBackendService, GnroButtonConfg, GnroDataType } from '@gnro/ui/core';
import { GnroFormWindowConfig, formWindowActions } from '@gnro/ui/form-window';
import { remoteButtonActions, remoteDeleteActions, remoteExportsActions } from '@gnro/ui/remote';
import { Store } from '@ngrx/store';
import { GnroGridFeatureService } from './grid-state.module';
import {
  GnroCellEdit,
  GnroColumnConfig,
  GnroColumnFilter,
  GnroGridConfig,
  GnroGridData,
  GnroGridRowSelections,
  GnroGridSetting,
  GnroRowGroupField,
  GnroSortField,
} from '../models/grid.model';
import { filterHttpParams } from '../utils/filter-http-params';
import { GnroRowGroup } from '../utils/row-group/row-group';
import { GnroRowGroups } from '../utils/row-group/row-groups';
import { sortHttpParams } from '../utils/sort-http-params';
import { gridActions } from './grid.actions';
import { createGridSelectorsForFeature } from './grid.selectors';

@Injectable({ providedIn: 'root' })
export class GnroGridFacade {
  private readonly store = inject(Store);
  private readonly backendService = inject(GnroBackendService);
  private readonly gridFeatureService = inject(GnroGridFeatureService);

  initConfig(gridName: string, gridConfig: GnroGridConfig, gridType: string): void {
    // Dynamically register the feature for this gridName
    this.gridFeatureService.registerFeature(gridName);

    this.store.dispatch(gridActions.initConfig({ gridName, gridConfig, gridType }));
    if (gridConfig.remoteGridConfig) {
      this.store.dispatch(gridActions.loadConfig({ gridName, gridConfig }));
    } else if (gridConfig.remoteColumnsConfig) {
      this.store.dispatch(gridActions.loadColumnsConfig({ gridName }));
    } else if (gridConfig.rowGroupField) {
      this.initRowGroup(gridName, gridConfig);
    }
  }

  initRowGroup(gridName: string, gridConfig: GnroGridConfig): void {
    if (gridConfig.rowGroupField) {
      this.setGroupBy(gridName, gridConfig, gridConfig.rowGroupField);
    }
  }

  setColumnsConfig(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, columnsConfig: GnroColumnConfig[]): void {
    const gridName = gridConfig.gridName;
    const isTreeGrid = gridSetting.isTreeGrid;
    this.store.dispatch(gridActions.loadColumnsConfigSuccess({ gridName, gridConfig, isTreeGrid, columnsConfig }));
  }

  setViewportPageSize(
    gridConfig: GnroGridConfig,
    gridSetting: GnroGridSetting,
    pageSize: number,
    viewportWidth: number,
    loadData: boolean,
  ): void {
    const gridName = gridConfig.gridName;
    this.store.dispatch(gridActions.setViewportPageSize({ gridName, gridConfig, pageSize, viewportWidth }));
    if (gridSetting.viewportReady && loadData && !gridSetting.isTreeGrid) {
      this.getData(gridName, gridSetting);
    }
  }

  setWindowResize(
    gridConfig: GnroGridConfig,
    gridSetting: GnroGridSetting,
    pageSize: number,
    viewportWidth: number,
    loadData: boolean,
  ): void {
    const gridName = gridConfig.gridName;
    this.store.dispatch(gridActions.setViewportPageSize({ gridName, gridConfig, pageSize, viewportWidth }));
    if (gridSetting.viewportReady && loadData && !gridSetting.isTreeGrid) {
      this.store.dispatch(gridActions.getConcatData({ gridName }));
    }
  }

  setSortFields(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, sortFields: GnroSortField[]): void {
    const gridName = gridConfig.gridName;
    const isTreeGrid = gridSetting.isTreeGrid;
    sortFields = this.checkGroupSortField(gridConfig, sortFields);
    this.store.dispatch(gridActions.setSortFields({ gridName, gridConfig, isTreeGrid, sortFields }));
    this.getData(gridName, gridSetting);
  }

  setColumnFilters(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, columnFilters: GnroColumnFilter[]): void {
    const gridName = gridConfig.gridName;
    const isTreeGrid = gridSetting.isTreeGrid;
    this.store.dispatch(gridActions.setColumnFilters({ gridName, gridConfig, isTreeGrid, columnFilters }));
    //if (!gridSetting.columnUpdating) {
    this.getData(gridName, gridSetting);
    //}
  }

  setColumnConfig(gridName: string, columnsConfig: GnroColumnConfig): void {
    this.store.dispatch(gridActions.setColumnsConfig({ gridName, columnsConfig }));
  }

  setFormWindowConfig(gridName: string, formWindowConfig: GnroFormWindowConfig): void {
    this.store.dispatch(gridActions.loadFormWindowConfigSuccess({ gridName, formWindowConfig }));
  }

  setSelectAllRows(gridName: string, selectAll: boolean): void {
    this.store.dispatch(gridActions.setSelectAllRows({ gridName, selectAll }));
  }

  setSelectRows<T>(gridName: string, records: T[], isSelected: boolean, selected: number): void {
    this.store.dispatch(gridActions.setSelectRows({ gridName, records, isSelected, selected }));
  }

  setSelectRow<T>(gridName: string, record: T): void {
    this.store.dispatch(gridActions.setSelectRow({ gridName, record }));
  }

  setGroupBy(gridName: string, gridConfig: GnroGridConfig, rowGroupField: GnroRowGroupField): void {
    this.store.dispatch(gridActions.setUnGroupBy({ gridName, gridConfig }));
    const sortFields = this.getGroupSortField(gridConfig, rowGroupField);
    this.store.dispatch(gridActions.setGroupBy({ gridName, gridConfig, rowGroupField }));
    const isTreeGrid = false;
    this.store.dispatch(gridActions.setSortFields({ gridName, gridConfig, isTreeGrid, sortFields }));
    this.dispatchGetData(gridName);
  }

  private checkGroupSortField(gridConfig: GnroGridConfig, sortFields: GnroSortField[]): GnroSortField[] {
    if (gridConfig.rowGroupField) {
      const find = sortFields.find((column) => column.field === gridConfig.sortFields[0].field);
      if (!find) {
        return [...[gridConfig.sortFields[0]], ...[sortFields[0]]];
      }
    }
    return sortFields;
  }

  private getGroupSortField(gridConfig: GnroGridConfig, rowGroupField: GnroRowGroupField): GnroSortField[] {
    const sortFields = gridConfig.sortFields;
    const find = sortFields.find((column) => column.field === rowGroupField.field);
    if (find) {
      if (sortFields.length > 1) {
        const sort = sortFields.filter((column) => column.field !== rowGroupField.field)[0];
        return [...[find], ...[sort]];
      } else {
        return [find];
      }
    } else {
      return [
        {
          field: rowGroupField.field,
          dir: rowGroupField.dir,
        },
      ];
    }
  }

  setToggleRowGroup(gridName: string, rowGroup: GnroRowGroup): void {
    this.store.dispatch(gridActions.setToggleRowGroup({ gridName, rowGroup }));
  }

  setUnGroupBy(gridName: string, gridConfig: GnroGridConfig): void {
    this.store.dispatch(gridActions.setUnGroupBy({ gridName, gridConfig }));
  }

  setEditable(gridName: string, gridEditable: boolean): void {
    this.store.dispatch(gridActions.setEditable({ gridName, gridEditable }));
  }

  setResetEdit(gridName: string, restEdit: boolean): void {
    this.store.dispatch(gridActions.setResetEdit({ gridName, restEdit }));
  }

  setRecordModified<T>(gridName: string, modified: GnroCellEdit<T>): void {
    this.store.dispatch(gridActions.setRecordModified({ gridName, modified }));
  }

  saveModifiedRecords(gridName: string): void {
    this.store.dispatch(gridActions.saveModifiedRecords({ gridName }));
  }

  getPageData(gridName: string, page: number): void {
    this.store.dispatch(gridActions.setViewportPage({ gridName, page }));
    this.dispatchGetData(gridName);
  }

  setGridScrollIndex(gridName: string, scrollIndex: number): void {
    this.store.dispatch(gridActions.setScrollIndex({ gridName, scrollIndex }));
  }

  refresh(gridName: string): void {
    if (this.getConfig(gridName)().virtualScroll) {
      this.getPageData(gridName, 1);
    } else {
      this.getData(gridName, this.getSetting(gridName)());
    }
  }

  getData(gridName: string, gridSetting: GnroGridSetting): void {
    if (!gridSetting.isTreeGrid) {
      if (gridSetting.lastUpdateTime) {
        this.dispatchGetData(gridName);
      } else {
        // make sure first time to use load
        this.store.dispatch(gridActions.getConcatData({ gridName }));
      }
    } else {
      this.setLoadTreeDataLoading(gridName, true);
    }
  }

  private dispatchGetData(gridName: string): void {
    this.store.dispatch(gridActions.getData({ gridName }));
  }

  setInMemoryData<T>(gridName: string, gridConfig: GnroGridConfig, gridData: GnroGridData<T>): void {
    this.store.dispatch(gridActions.setInMemoryData({ gridName, gridConfig, gridData }));
    this.dispatchGetData(gridName);
  }

  clearStore(gridName: string): void {
    this.store.dispatch(gridActions.clearStore({ gridName }));
  }

  getConfig(gridName: string): Signal<GnroGridConfig> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectGridConfig);
  }

  getSetting(gridName: string): Signal<GnroGridSetting> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectGridSetting);
  }

  getColumnsConfig(gridName: string): Signal<GnroColumnConfig[]> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectColumnsConfig);
  }

  getFormWindowConfig(gridName: string): Signal<GnroFormWindowConfig | undefined> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectFormWindowConfig);
  }

  getModifiedRecords<T>(gridName: string): Signal<T[]> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectGridModifiedRecords) as Signal<T[]>;
  }

  getSignalData<T>(gridName: string): Signal<T[]> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectGridData) as Signal<T[]>;
  }

  getRowSelection<T>(gridName: string): Signal<GnroGridRowSelections<T> | undefined> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectRowSelection) as Signal<GnroGridRowSelections<T> | undefined>;
  }

  getInMemoryData<T>(gridName: string): Signal<T[]> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectGridInMemoryData) as Signal<T[]>;
  }

  getRowGroups(gridName: string): Signal<GnroRowGroups | boolean> {
    const selectors = createGridSelectorsForFeature(gridName);
    return this.store.selectSignal(selectors.selectRowGroups);
  }

  openButtonClick(gridName: string): void {
    const selected = this.getRowSelection(gridName)()?.selection.selected;
    if (selected && selected.length > 0) {
      this.openFormWindow(gridName, selected[0], false);
    }
  }

  rowDblClick<T>(gridName: string, record: T): void {
    this.store.dispatch(gridActions.setSelectRow({ gridName, record }));
    this.openFormWindow(gridName, record, false);
  }

  addNewRecord(gridName: string): void {
    const record = this.getSelectedRecord(gridName);
    this.openFormWindow(gridName, record, true);
  }

  deleteRecords(gridName: string): void {
    const data = this.getRowSelection(gridName)()?.selection.selected as GnroDataType[];
    if (data && data.length > 0) {
      const gridConfig = this.getConfig(gridName)();
      const keyName = gridConfig.gridName;
      const recordKey = gridConfig.recordKey;
      const selected = data.map((item) => ({ [recordKey]: item[recordKey as keyof typeof item] }));
      this.store.dispatch(remoteDeleteActions.openConfirmationWindow({ stateId: gridName, keyName, selected }));
    }
  }

  exports(gridName: string): void {
    this.store.dispatch(gridActions.saveConfigs({ gridName }));
    const gridConfig = this.getConfig(gridName)();
    const columns = this.getColumnsConfig(gridName)();
    let params = this.backendService.getParams(gridConfig.gridName, 'exports');
    params = filterHttpParams(gridConfig.columnFilters, columns, params);
    params = sortHttpParams(gridConfig.sortFields, params);
    this.store.dispatch(remoteExportsActions.open({ params }));
  }

  /*
  imports(gridName: string): void {
    this.store.dispatch(gridActions.saveGridConfigs({ gridName }));
    const gridConfig = this.getGridConfig(gridName)();
    let params = this.backendService.getParams(gridConfig.urlKey, 'imports');
    this.store.dispatch(openRemoteImportsWindowAction({ stateId: gridName, keyName: gridConfig.urlKey, params }));
  }*/

  private getSelectedRecord<T>(gridName: string): T {
    const selected = this.getRowSelection(gridName)()?.selection.selected;
    if (selected && selected.length > 0) {
      const record = selected[0] as T;
      const gridConfig = this.getConfig(gridName)();
      return {
        ...record,
        [gridConfig.recordKey]: undefined,
      } as T;
    }
    return {} as T;
  }
  private openFormWindow<T>(stateId: string, values: T, editing: boolean): void {
    const config = this.getFormWindowConfig(stateId)();
    if (config) {
      const formWindowConfig = {
        ...config,
        formConfig: {
          ...config.formConfig,
          editing: editing,
        },
        values: values as GnroDataType,
      };
      console.log(' formWindowConfig=', formWindowConfig);
      this.store.dispatch(formWindowActions.open({ stateId, formWindowConfig }));
    }
  }

  setLoadTreeDataLoading(gridName: string, loading: boolean): void {
    this.store.dispatch(gridActions.setLoadTreeDataLoading({ gridName, loading }));
  }

  runTask(gridName: string): void {
    this.store.dispatch(gridActions.getConcatData({ gridName }));
  }

  buttonRemoteClick(gridName: string, button: GnroButtonConfg): void {
    console.log(' button=', button);
    this.store.dispatch(remoteButtonActions.click({ button, keyName: 'DCR', configType: 'record', formData: {} }));
  }
}
