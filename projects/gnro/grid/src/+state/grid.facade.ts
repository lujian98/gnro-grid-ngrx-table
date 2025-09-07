import { inject, Injectable, Signal } from '@angular/core';
import { GnroBackendService, GnroButtonConfg } from '@gnro/ui/core';
import { GnroFormWindowConfig, formWindowActions } from '@gnro/ui/form-window';
import { buttonRemoteAction, openDeleteConfirmationAction, openRemoteExportsWindowAction } from '@gnro/ui/remote';
import { Store } from '@ngrx/store';
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
import {
  selectColumnsConfig,
  selectFormWindowConfig,
  selectGridConfig,
  selectGridData,
  selectGridInMemoryData,
  selectGridModifiedRecords,
  selectGridSetting,
  selectRowGroups,
  selectRowSelection,
} from './grid.selectors';

@Injectable({ providedIn: 'root' })
export class GnroGridFacade {
  private readonly store = inject(Store);
  private readonly backendService = inject(GnroBackendService);

  initConfig(gridId: string, gridConfig: GnroGridConfig, gridType: string): void {
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
    const gridId = gridSetting.gridId;
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
    const gridId = gridSetting.gridId;
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
    const gridId = gridSetting.gridId;
    this.store.dispatch(gridActions.setViewportPageSize({ gridId, gridConfig, pageSize, viewportWidth }));
    if (gridSetting.viewportReady && loadData && !gridSetting.isTreeGrid) {
      this.store.dispatch(gridActions.getConcatData({ gridId }));
    }
  }

  setSortFields(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, sortFields: GnroSortField[]): void {
    const gridId = gridSetting.gridId;
    const isTreeGrid = gridSetting.isTreeGrid;
    sortFields = this.checkGroupSortField(gridConfig, sortFields);
    this.store.dispatch(gridActions.setSortFields({ gridId, gridConfig, isTreeGrid, sortFields }));
    this.getData(gridId, gridSetting);
  }

  setColumnFilters(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, columnFilters: GnroColumnFilter[]): void {
    const gridId = gridSetting.gridId;
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

  setSelectRows(gridId: string, records: object[], isSelected: boolean, selected: number): void {
    this.store.dispatch(gridActions.setSelectRows({ gridId, records, isSelected, selected }));
  }

  setSelectRow(gridId: string, record: object): void {
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

  setRecordModified(gridId: string, modified: GnroCellEdit<unknown>): void {
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

  setInMemoryData(gridId: string, gridConfig: GnroGridConfig, gridData: GnroGridData<object>): void {
    this.store.dispatch(gridActions.setInMemoryData({ gridId, gridConfig, gridData }));
    this.dispatchGetData(gridId);
  }

  clearStore(gridId: string): void {
    this.store.dispatch(gridActions.clearStore({ gridId }));
  }

  getConfig(gridId: string): Signal<GnroGridConfig> {
    return this.store.selectSignal(selectGridConfig(gridId));
  }

  getSetting(gridId: string): Signal<GnroGridSetting> {
    return this.store.selectSignal(selectGridSetting(gridId));
  }

  getColumnsConfig(gridId: string): Signal<GnroColumnConfig[]> {
    return this.store.selectSignal(selectColumnsConfig(gridId));
  }

  getFormWindowConfig(gridId: string): Signal<GnroFormWindowConfig | undefined> {
    return this.store.selectSignal(selectFormWindowConfig(gridId));
  }

  getModifiedRecords(gridId: string): Signal<{ [key: string]: unknown }[]> {
    return this.store.selectSignal(selectGridModifiedRecords(gridId)) as Signal<{ [key: string]: unknown }[]>;
  }

  getSignalData(gridId: string): Signal<object[]> {
    return this.store.selectSignal(selectGridData(gridId));
  }

  getRowSelection(gridId: string): Signal<GnroGridRowSelections<object> | undefined> {
    return this.store.selectSignal(selectRowSelection(gridId));
  }

  getInMemoryData<T>(gridId: string): Signal<T[]> {
    return this.store.selectSignal(selectGridInMemoryData(gridId)) as Signal<T[]>;
  }

  getRowGroups(gridId: string): Signal<GnroRowGroups | boolean> {
    return this.store.selectSignal(selectRowGroups(gridId));
  }

  openButtonClick(gridId: string): void {
    const selected = this.getRowSelection(gridId)()?.selection.selected;
    if (selected && selected.length > 0) {
      this.openFormWindow(gridId, selected[0], false);
    }
  }

  rowDblClick(gridId: string, record: object): void {
    this.store.dispatch(gridActions.setSelectRow({ gridId, record }));
    this.openFormWindow(gridId, record, false);
  }

  addNewRecord(gridId: string): void {
    const record = this.getSelectedRecord(gridId);
    this.openFormWindow(gridId, record, true);
  }

  deleteRecords(gridId: string): void {
    const data = this.getRowSelection(gridId)()?.selection.selected;
    if (data && data.length > 0) {
      const gridConfig = this.getConfig(gridId)();
      const keyName = gridConfig.urlKey;
      const recordKey = gridConfig.recordKey;
      const selected = data.map((item: object) => ({ [recordKey]: item[recordKey as keyof typeof item] }));
      this.store.dispatch(openDeleteConfirmationAction({ stateId: gridId, keyName, selected }));
    }
  }

  exports(gridId: string): void {
    this.store.dispatch(gridActions.saveConfigs({ gridId }));
    const gridConfig = this.getConfig(gridId)();
    const columns = this.getColumnsConfig(gridId)();
    let params = this.backendService.getParams(gridConfig.urlKey, 'exports');
    params = filterHttpParams(gridConfig.columnFilters, columns, params);
    params = sortHttpParams(gridConfig.sortFields, params);
    this.store.dispatch(openRemoteExportsWindowAction({ params }));
  }

  /*
  imports(gridId: string): void {
    this.store.dispatch(gridActions.saveGridConfigs({ gridId }));
    const gridConfig = this.getGridConfig(gridId)();
    let params = this.backendService.getParams(gridConfig.urlKey, 'imports');
    this.store.dispatch(openRemoteImportsWindowAction({ stateId: gridId, keyName: gridConfig.urlKey, params }));
  }*/

  private getSelectedRecord(gridId: string): object {
    const selected = this.getRowSelection(gridId)()?.selection.selected;
    if (selected && selected.length > 0) {
      const record = selected[0];
      const gridConfig = this.getConfig(gridId)();
      return {
        ...record,
        [gridConfig.recordKey]: undefined,
      };
    }
    return {};
  }
  private openFormWindow(stateId: string, values: object, editing: boolean): void {
    const config = this.getFormWindowConfig(stateId)();
    if (config) {
      const formWindowConfig = {
        ...config,
        formConfig: {
          ...config.formConfig,
          editing: editing,
        },
        values,
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
    this.store.dispatch(gridActions.getConcatData({ gridId: setting.gridId }));
  }

  buttonRemoteAction(gridId: string, button: GnroButtonConfg): void {
    console.log(' button=', button);
    this.store.dispatch(buttonRemoteAction({ button, keyName: 'DCR', configType: 'record', formData: {} }));
  }
}
