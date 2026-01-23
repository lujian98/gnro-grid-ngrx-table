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

  initConfig(gridId: string, gridConfig: GnroGridConfig, gridType: string): void {
    // Dynamically register the feature for this gridName
    this.gridFeatureService.registerFeature(gridId);

    this.store.dispatch(gridActions.initConfig({ gridId, gridConfig, gridType }));
    if (gridConfig.remoteGridConfig) {
      this.store.dispatch(gridActions.loadConfig({ gridId, gridConfig }));
    } else if (gridConfig.remoteColumnsConfig) {
      this.store.dispatch(gridActions.loadColumnsConfig({ gridId }));
    } else if (gridConfig.rowGroupField) {
      this.initRowGroup(gridId, gridConfig);
    }
  }

  initRowGroup(gridId: string, gridConfig: GnroGridConfig): void {
    if (gridConfig.rowGroupField) {
      this.setGroupBy(gridId, gridConfig, gridConfig.rowGroupField);
    }
  }

  setColumnsConfig(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, columnsConfig: GnroColumnConfig[]): void {
    const gridId = gridConfig.gridName;
    const isTreeGrid = gridSetting.isTreeGrid;
    this.store.dispatch(gridActions.loadColumnsConfigSuccess({ gridId, gridConfig, isTreeGrid, columnsConfig }));
  }

  setViewportPageSize(
    gridConfig: GnroGridConfig,
    gridSetting: GnroGridSetting,
    pageSize: number,
    viewportWidth: number,
    loadData: boolean,
  ): void {
    const gridId = gridConfig.gridName;
    this.store.dispatch(gridActions.setViewportPageSize({ gridId, gridConfig, pageSize, viewportWidth }));
    if (gridSetting.viewportReady && loadData && !gridSetting.isTreeGrid) {
      this.getData(gridId, gridSetting);
    }
  }

  setWindowResize(
    gridConfig: GnroGridConfig,
    gridSetting: GnroGridSetting,
    pageSize: number,
    viewportWidth: number,
    loadData: boolean,
  ): void {
    const gridId = gridConfig.gridName;
    this.store.dispatch(gridActions.setViewportPageSize({ gridId, gridConfig, pageSize, viewportWidth }));
    if (gridSetting.viewportReady && loadData && !gridSetting.isTreeGrid) {
      this.store.dispatch(gridActions.getConcatData({ gridId }));
    }
  }

  setSortFields(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, sortFields: GnroSortField[]): void {
    const gridId = gridConfig.gridName;
    const isTreeGrid = gridSetting.isTreeGrid;
    sortFields = this.checkGroupSortField(gridConfig, sortFields);
    this.store.dispatch(gridActions.setSortFields({ gridId, gridConfig, isTreeGrid, sortFields }));
    this.getData(gridId, gridSetting);
  }

  setColumnFilters(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, columnFilters: GnroColumnFilter[]): void {
    const gridId = gridConfig.gridName;
    const isTreeGrid = gridSetting.isTreeGrid;
    this.store.dispatch(gridActions.setColumnFilters({ gridId, gridConfig, isTreeGrid, columnFilters }));
    //if (!gridSetting.columnUpdating) {
    this.getData(gridId, gridSetting);
    //}
  }

  setColumnConfig(gridId: string, columnsConfig: GnroColumnConfig): void {
    this.store.dispatch(gridActions.setColumnsConfig({ gridId, columnsConfig }));
  }

  setFormWindowConfig(gridId: string, formWindowConfig: GnroFormWindowConfig): void {
    this.store.dispatch(gridActions.loadFormWindowConfigSuccess({ gridId, formWindowConfig }));
  }

  setSelectAllRows(gridId: string, selectAll: boolean): void {
    this.store.dispatch(gridActions.setSelectAllRows({ gridId, selectAll }));
  }

  setSelectRows<T>(gridId: string, records: T[], isSelected: boolean, selected: number): void {
    this.store.dispatch(gridActions.setSelectRows({ gridId, records, isSelected, selected }));
  }

  setSelectRow<T>(gridId: string, record: T): void {
    this.store.dispatch(gridActions.setSelectRow({ gridId, record }));
  }

  setGroupBy(gridId: string, gridConfig: GnroGridConfig, rowGroupField: GnroRowGroupField): void {
    this.store.dispatch(gridActions.setUnGroupBy({ gridId, gridConfig }));
    const sortFields = this.getGroupSortField(gridConfig, rowGroupField);
    this.store.dispatch(gridActions.setGroupBy({ gridId, gridConfig, rowGroupField }));
    const isTreeGrid = false;
    this.store.dispatch(gridActions.setSortFields({ gridId, gridConfig, isTreeGrid, sortFields }));
    this.dispatchGetData(gridId);
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

  setToggleRowGroup(gridId: string, rowGroup: GnroRowGroup): void {
    this.store.dispatch(gridActions.setToggleRowGroup({ gridId, rowGroup }));
  }

  setUnGroupBy(gridId: string, gridConfig: GnroGridConfig): void {
    this.store.dispatch(gridActions.setUnGroupBy({ gridId, gridConfig }));
  }

  setEditable(gridId: string, gridEditable: boolean): void {
    this.store.dispatch(gridActions.setEditable({ gridId, gridEditable }));
  }

  setResetEdit(gridId: string, restEdit: boolean): void {
    this.store.dispatch(gridActions.setResetEdit({ gridId, restEdit }));
  }

  setRecordModified<T>(gridId: string, modified: GnroCellEdit<T>): void {
    this.store.dispatch(gridActions.setRecordModified({ gridId, modified }));
  }

  saveModifiedRecords(gridId: string): void {
    this.store.dispatch(gridActions.saveModifiedRecords({ gridId }));
  }

  getPageData(gridId: string, page: number): void {
    this.store.dispatch(gridActions.setViewportPage({ gridId, page }));
    this.dispatchGetData(gridId);
  }

  setGridScrollIndex(gridId: string, scrollIndex: number): void {
    this.store.dispatch(gridActions.setScrollIndex({ gridId, scrollIndex }));
  }

  refresh(gridId: string): void {
    if (this.getConfig(gridId)().virtualScroll) {
      this.getPageData(gridId, 1);
    } else {
      this.getData(gridId, this.getSetting(gridId)());
    }
  }

  getData(gridId: string, gridSetting: GnroGridSetting): void {
    if (!gridSetting.isTreeGrid) {
      if (gridSetting.lastUpdateTime) {
        this.dispatchGetData(gridId);
      } else {
        // make sure first time to use load
        this.store.dispatch(gridActions.getConcatData({ gridId }));
      }
    } else {
      this.setLoadTreeDataLoading(gridId, true);
    }
  }

  private dispatchGetData(gridId: string): void {
    this.store.dispatch(gridActions.getData({ gridId }));
  }

  setInMemoryData<T>(gridId: string, gridConfig: GnroGridConfig, gridData: GnroGridData<T>): void {
    this.store.dispatch(gridActions.setInMemoryData({ gridId, gridConfig, gridData }));
    this.dispatchGetData(gridId);
  }

  clearStore(gridId: string): void {
    this.store.dispatch(gridActions.clearStore({ gridId }));
  }

  getConfig(gridId: string): Signal<GnroGridConfig> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectGridConfig);
  }

  getSetting(gridId: string): Signal<GnroGridSetting> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectGridSetting);
  }

  getColumnsConfig(gridId: string): Signal<GnroColumnConfig[]> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectColumnsConfig);
  }

  getFormWindowConfig(gridId: string): Signal<GnroFormWindowConfig | undefined> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectFormWindowConfig);
  }

  getModifiedRecords<T>(gridId: string): Signal<T[]> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectGridModifiedRecords) as Signal<T[]>;
  }

  getSignalData<T>(gridId: string): Signal<T[]> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectGridData) as Signal<T[]>;
  }

  getRowSelection<T>(gridId: string): Signal<GnroGridRowSelections<T> | undefined> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectRowSelection) as Signal<GnroGridRowSelections<T> | undefined>;
  }

  getInMemoryData<T>(gridId: string): Signal<T[]> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectGridInMemoryData) as Signal<T[]>;
  }

  getRowGroups(gridId: string): Signal<GnroRowGroups | boolean> {
    const selectors = createGridSelectorsForFeature(gridId);
    return this.store.selectSignal(selectors.selectRowGroups);
  }

  openButtonClick(gridId: string): void {
    const selected = this.getRowSelection(gridId)()?.selection.selected;
    if (selected && selected.length > 0) {
      this.openFormWindow(gridId, selected[0], false);
    }
  }

  rowDblClick<T>(gridId: string, record: T): void {
    this.store.dispatch(gridActions.setSelectRow({ gridId, record }));
    this.openFormWindow(gridId, record, false);
  }

  addNewRecord(gridId: string): void {
    const record = this.getSelectedRecord(gridId);
    this.openFormWindow(gridId, record, true);
  }

  deleteRecords(gridId: string): void {
    const data = this.getRowSelection(gridId)()?.selection.selected as GnroDataType[];
    if (data && data.length > 0) {
      const gridConfig = this.getConfig(gridId)();
      const keyName = gridConfig.gridName;
      const recordKey = gridConfig.recordKey;
      const selected = data.map((item) => ({ [recordKey]: item[recordKey as keyof typeof item] }));
      this.store.dispatch(remoteDeleteActions.openConfirmationWindow({ stateId: gridId, keyName, selected }));
    }
  }

  exports(gridId: string): void {
    this.store.dispatch(gridActions.saveConfigs({ gridId }));
    const gridConfig = this.getConfig(gridId)();
    const columns = this.getColumnsConfig(gridId)();
    let params = this.backendService.getParams(gridConfig.gridName, 'exports');
    params = filterHttpParams(gridConfig.columnFilters, columns, params);
    params = sortHttpParams(gridConfig.sortFields, params);
    this.store.dispatch(remoteExportsActions.open({ params }));
  }

  /*
  imports(gridId: string): void {
    this.store.dispatch(gridActions.saveGridConfigs({ gridId }));
    const gridConfig = this.getGridConfig(gridId)();
    let params = this.backendService.getParams(gridConfig.urlKey, 'imports');
    this.store.dispatch(openRemoteImportsWindowAction({ stateId: gridId, keyName: gridConfig.urlKey, params }));
  }*/

  private getSelectedRecord<T>(gridId: string): T {
    const selected = this.getRowSelection(gridId)()?.selection.selected;
    if (selected && selected.length > 0) {
      const record = selected[0] as T;
      const gridConfig = this.getConfig(gridId)();
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

  setLoadTreeDataLoading(gridId: string, loading: boolean): void {
    this.store.dispatch(gridActions.setLoadTreeDataLoading({ gridId, loading }));
  }

  runTask(setting: GnroGridSetting): void {
    console.log(' runTask=', setting);
    //TODO
    //this.store.dispatch(gridActions.getConcatData({ gridId: setting.gridId }));
  }

  buttonRemoteClick(gridId: string, button: GnroButtonConfg): void {
    console.log(' button=', button);
    this.store.dispatch(remoteButtonActions.click({ button, keyName: 'DCR', configType: 'record', formData: {} }));
  }
}
