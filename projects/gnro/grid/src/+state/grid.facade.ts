import { inject, Injectable, Signal } from '@angular/core';
import { GnroFormWindowConfig, openFormWindowDialog } from '@gnro/ui/form-window';
import { GnroButtonConfg, GnroBUTTONS, GnroButtonType, GnroTasksService, uniqueId } from '@gnro/ui/core';
import { buttonRemoteAction } from '@gnro/ui/remote';
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
import { GnroRowGroup } from '../utils/row-group/row-group';
import { GnroRowGroups } from '../utils/row-group/row-groups';
import * as gridActions from './grid.actions';
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

  initGridConfig(gridId: string, gridConfig: GnroGridConfig, gridType: string): void {
    this.store.dispatch(gridActions.initGridConfig({ gridId, gridConfig, gridType }));
    if (gridConfig.remoteGridConfig) {
      this.store.dispatch(gridActions.loadGridConfig({ gridId, gridConfig }));
    } else if (gridConfig.remoteColumnsConfig) {
      this.store.dispatch(gridActions.loadGridColumnsConfig({ gridId }));
    } else if (gridConfig.rowGroupField) {
      this.initRowGroup(gridId, gridConfig);
    }
  }

  initRowGroup(gridId: string, gridConfig: GnroGridConfig): void {
    if (gridConfig.rowGroupField) {
      this.setGridGroupBy(gridId, gridConfig, gridConfig.rowGroupField);
    }
  }

  setGridColumnsConfig(
    gridConfig: GnroGridConfig,
    gridSetting: GnroGridSetting,
    columnsConfig: GnroColumnConfig[],
  ): void {
    const gridId = gridSetting.gridId;
    const isTreeGrid = gridSetting.isTreeGrid;
    this.store.dispatch(gridActions.loadGridColumnsConfigSuccess({ gridId, gridConfig, isTreeGrid, columnsConfig }));
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
      this.getGridData(gridId, gridSetting);
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
      this.store.dispatch(gridActions.getConcatGridData({ gridId }));
    }
  }

  setGridSortFields(gridConfig: GnroGridConfig, gridSetting: GnroGridSetting, sortFields: GnroSortField[]): void {
    const gridId = gridSetting.gridId;
    const isTreeGrid = gridSetting.isTreeGrid;
    sortFields = this.checkGroupSortField(gridConfig, sortFields);
    this.store.dispatch(gridActions.setGridSortFields({ gridId, gridConfig, isTreeGrid, sortFields }));
    this.getGridData(gridId, gridSetting);
  }

  setGridColumnFilters(
    gridConfig: GnroGridConfig,
    gridSetting: GnroGridSetting,
    columnFilters: GnroColumnFilter[],
  ): void {
    const gridId = gridSetting.gridId;
    const isTreeGrid = gridSetting.isTreeGrid;
    this.store.dispatch(gridActions.setGridColumnFilters({ gridId, gridConfig, isTreeGrid, columnFilters }));
    //if (!gridSetting.columnUpdating) {
    this.getGridData(gridId, gridSetting);
    //}
  }

  setGridColumnConfig(gridId: string, columnsConfig: GnroColumnConfig): void {
    this.store.dispatch(gridActions.setGridColumnsConfig({ gridId, columnsConfig }));
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

  setGridGroupBy(gridId: string, gridConfig: GnroGridConfig, rowGroupField: GnroRowGroupField): void {
    this.store.dispatch(gridActions.setGridUnGroupBy({ gridId, gridConfig }));
    const sortFields = this.getGroupSortField(gridConfig, rowGroupField);
    this.store.dispatch(gridActions.setGridGroupBy({ gridId, gridConfig, rowGroupField }));
    const isTreeGrid = false;
    this.store.dispatch(gridActions.setGridSortFields({ gridId, gridConfig, isTreeGrid, sortFields }));
    this.dispatchGridData(gridId);
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

  setGridUnGroupBy(gridId: string, gridConfig: GnroGridConfig): void {
    this.store.dispatch(gridActions.setGridUnGroupBy({ gridId, gridConfig }));
  }

  setGridEditable(gridId: string, gridEditable: boolean): void {
    this.store.dispatch(gridActions.setGridEditable({ gridId, gridEditable }));
  }

  setGridRestEdit(gridId: string, restEdit: boolean): void {
    this.store.dispatch(gridActions.setGridRestEdit({ gridId, restEdit }));
  }

  setGridRecordModified(gridId: string, modified: GnroCellEdit<unknown>): void {
    this.store.dispatch(gridActions.setGridRecordModified({ gridId, modified }));
  }

  saveGridModifiedRecords(gridId: string): void {
    this.store.dispatch(gridActions.saveGridModifiedRecords({ gridId }));
  }

  getGridPageData(gridId: string, page: number): void {
    this.store.dispatch(gridActions.setViewportPage({ gridId, page }));
    this.dispatchGridData(gridId);
  }

  setGridScrollIndex(gridId: string, scrollIndex: number): void {
    this.store.dispatch(gridActions.setGridScrollIndex({ gridId, scrollIndex }));
  }

  getGridData(gridId: string, gridSetting: GnroGridSetting): void {
    if (!gridSetting.isTreeGrid) {
      if (gridSetting.lastUpdateTime) {
        this.dispatchGridData(gridId);
      } else {
        // make sure first time to use load
        this.store.dispatch(gridActions.getConcatGridData({ gridId }));
      }
    } else {
      this.setLoadTreeDataLoading(gridId, true);
    }
  }

  private dispatchGridData(gridId: string): void {
    this.store.dispatch(gridActions.getGridData({ gridId }));
  }

  setGridInMemoryData(gridId: string, gridConfig: GnroGridConfig, gridData: GnroGridData<object>): void {
    this.store.dispatch(gridActions.setGridInMemoryData({ gridId, gridConfig, gridData }));
    this.dispatchGridData(gridId);
  }

  clearGridDataStore(gridId: string): void {
    this.store.dispatch(gridActions.clearGridDataStore({ gridId }));
  }

  getGridConfig(gridId: string): Signal<GnroGridConfig> {
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

  getGridModifiedRecords(gridId: string): Signal<{ [key: string]: unknown }[]> {
    return this.store.selectSignal(selectGridModifiedRecords(gridId)) as Signal<{ [key: string]: unknown }[]>;
  }

  getGridSignalData(gridId: string): Signal<object[]> {
    return this.store.selectSignal(selectGridData(gridId));
  }

  getRowSelection(gridId: string): Signal<GnroGridRowSelections<object> | undefined> {
    return this.store.selectSignal(selectRowSelection(gridId));
  }

  getGridInMemoryData<T>(gridId: string): Signal<T[]> {
    return this.store.selectSignal(selectGridInMemoryData(gridId)) as Signal<T[]>;
  }

  getRowGroups(gridId: string): Signal<GnroRowGroups | boolean> {
    return this.store.selectSignal(selectRowGroups(gridId));
  }

  openButtonClick(gridId: string): void {
    const selected = this.getRowSelection(gridId)()?.selection.selected;
    if (selected && selected.length > 0) {
      this.openGridFormWindow(gridId, selected[0]);
    }
  }

  rowDblClick(gridId: string, record: object): void {
    this.store.dispatch(gridActions.setSelectRow({ gridId, record }));
    this.openGridFormWindow(gridId, record);
  }

  addNewGridRecord(gridId: string): void {
    const record = this.getSelectedRecord(gridId);
    this.openGridFormWindow(gridId, record);
  }

  private getSelectedRecord(gridId: string): object {
    const selected = this.getRowSelection(gridId)()?.selection.selected;
    if (selected && selected.length > 0) {
      const record = selected[0];
      const gridConfig = this.getGridConfig(gridId)();
      return {
        ...record,
        [gridConfig.recordKey]: undefined,
      };
    }
    return {};
  }
  private openGridFormWindow(formWindowId: string, values: object): void {
    const config = this.getFormWindowConfig(formWindowId)();
    console.log('1111 formConfig=', config);
    if (config) {
      const formWindowConfig = {
        ...config,
        formConfig: {
          ...config.formConfig,
          editing: true,
        },
        values,
      };
      console.log('formWindowConfig=', formWindowConfig);
      this.store.dispatch(openFormWindowDialog({ formWindowId, formWindowConfig }));
    }
  }

  setLoadTreeDataLoading(gridId: string, loading: boolean): void {
    this.store.dispatch(gridActions.setLoadTreeDataLoading({ gridId, loading }));
  }

  runTask(setting: GnroGridSetting): void {
    this.store.dispatch(gridActions.getConcatGridData({ gridId: setting.gridId }));
  }

  buttonRemoteAction(gridId: string, button: GnroButtonConfg): void {
    console.log(' button=', button);
    this.store.dispatch(buttonRemoteAction({ button, keyName: 'DCR', configType: 'record', formData: {} }));
  }
}
