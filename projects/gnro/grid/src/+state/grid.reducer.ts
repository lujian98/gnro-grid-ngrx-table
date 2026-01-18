import { Action } from '@ngrx/store';
import { GnroDataType, GnroObjectType, GnroOnAction } from '@gnro/ui/core';
import { formWindowActions } from '@gnro/ui/form-window';
import { createFeature, createReducer, on } from '@ngrx/store';
import { MIN_GRID_COLUMN_WIDTH, VIRTUAL_SCROLL_PAGE_SIZE } from '../models/constants';
import { defaultState } from '../models/default-grid';
import { GnroGridState, GridState } from '../models/grid.model';
import { getFormFields } from '../utils/form-fields';
import { getModifiedRecords } from '../utils/modified-records';
import { GnroRowGroup } from '../utils/row-group/row-group';
import { GnroRowGroups } from '../utils/row-group/row-groups';
import { SelectionModel } from '@angular/cdk/collections';
import { getSelection, initSelection, setSelection } from '../utils/row-selection';
import { stickyEndMinWidth } from '../utils/viewport-width-ratio';
import { gridActions } from './grid.actions';

// Feature key generator for per-gridName feature slices
export function getGridFeatureKey(gridName: string): string {
  return `grid_${gridName}`;
}

// Initial state factory for per-gridName state
export function getInitialGridState<T>(gridName: string): GnroGridState<T> {
  return {
    ...defaultState(),
    gridConfig: {
      ...defaultState().gridConfig,
      gridName,
    },
    gridSetting: {
      ...defaultState().gridSetting,
      gridId: gridName,
    },
  };
}

// Cache for reducers by gridName
const gridReducersByFeature = new Map<
  string,
  (state: GnroGridState<unknown> | undefined, action: Action) => GnroGridState<unknown>
>();

// Factory function to create per-gridName reducers
export function createGridReducerForFeature(gridName: string) {
  // Return cached reducer if available
  const cached = gridReducersByFeature.get(gridName);
  if (cached) {
    return cached;
  }

  const initialState = getInitialGridState<unknown>(gridName);

  const gridReducer = createReducer(
    initialState,
    on(gridActions.initConfig, (state, action) => {
      if (action.gridId !== gridName) return state;
      const gridConfig = { ...action.gridConfig };
      // Always start from fresh initial state to avoid stale data from previous component instance
      const freshState = getInitialGridState<unknown>(gridName);
      return {
        ...freshState,
        gridConfig: {
          ...freshState.gridConfig,
          ...gridConfig,
          pageSize: !gridConfig.virtualScroll ? gridConfig.pageSize : VIRTUAL_SCROLL_PAGE_SIZE,
          columnSticky: gridConfig.horizontalScroll ? gridConfig.columnSticky : false,
        },
        gridSetting: {
          ...freshState.gridSetting,
          gridId: action.gridId,
          isTreeGrid: action.gridType === 'treeGrid',
          viewportReady: !gridConfig.remoteGridConfig && !gridConfig.remoteColumnsConfig,
        },
      };
    }),
    on(gridActions.loadConfigSuccess, (state, action) => {
      if (action.gridId !== gridName) return state;
      const gridConfig = { ...action.gridConfig };
      const pageSize = state.gridConfig.pageSize;
      return {
        ...state,
        gridConfig: {
          ...gridConfig,
          columnSticky: gridConfig.horizontalScroll ? gridConfig.columnSticky : false,
          pageSize:
            gridConfig.virtualScroll && pageSize < VIRTUAL_SCROLL_PAGE_SIZE ? VIRTUAL_SCROLL_PAGE_SIZE : pageSize,
        },
        gridSetting: {
          ...state.gridSetting,
          viewportReady: !action.gridConfig.remoteColumnsConfig,
        },
      };
    }),
    on(gridActions.loadColumnsConfigSuccess, (state, action) => {
      if (action.gridId !== gridName) return state;
      const gridConfig = state.gridConfig;
      const gridSetting = state.gridSetting;
      const allowHide = action.columnsConfig.filter((col) => col.allowHide === false).length;
      const columns = action.columnsConfig.map((column, index) => ({
        ...column,
        allowHide: allowHide === 0 && index === 0 ? false : column.allowHide,
        rendererType: column.rendererType || GnroObjectType.Text,
        width: column.width || MIN_GRID_COLUMN_WIDTH,
        sticky: gridSetting.isTreeGrid && column.name === 'name' ? true : column.sticky,
      }));
      const columnsConfig = stickyEndMinWidth(columns, gridConfig, gridSetting);
      const selection = initSelection(gridConfig, state.selection.selection);
      const formFields = getFormFields(gridConfig, columnsConfig);
      return {
        ...state,
        gridSetting: {
          ...gridSetting,
          viewportReady: true,
          columnUpdating: true,
        },
        columnsConfig,
        selection: getSelection(gridConfig, selection, state.data),
        formWindowConfig: {
          ...state.formWindowConfig,
          formConfig: {
            ...state.formWindowConfig.formConfig,
            urlKey: gridConfig.gridName,
          },
          formFields,
        },
      };
    }),
    on(gridActions.loadFormWindowConfigSuccess, (state, action) => {
      if (action.gridId !== gridName) return state;
      const formFields = action.formWindowConfig.formFields || [];
      return {
        ...state,
        formWindowConfig: {
          ...action.formWindowConfig,
          formFields: formFields.length === 0 ? state.formWindowConfig.formFields : formFields,
        },
      };
    }),
    on(gridActions.setViewportPageSize, (state, action) => {
      if (action.gridId !== gridName) return state;
      const gridConfig = state.gridConfig;
      const pageSize = gridConfig.virtualScroll || gridConfig.verticalScroll ? gridConfig.pageSize : action.pageSize;
      const gridSetting = {
        ...state.gridSetting,
        viewportWidth: action.viewportWidth,
        viewportSize: action.pageSize,
      };
      return {
        ...state,
        columnsConfig: stickyEndMinWidth(state.columnsConfig, gridConfig, gridSetting),
        gridConfig: { ...gridConfig, pageSize },
        gridSetting,
      };
    }),
    on(gridActions.setSortFields, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridConfig: { ...state.gridConfig, sortFields: action.sortFields, page: 1 },
      };
    }),
    on(gridActions.setColumnFilters, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridConfig: { ...state.gridConfig, columnFilters: action.columnFilters, page: 1 },
        gridSetting: { ...state.gridSetting, columnUpdating: false },
      };
    }),
    on(gridActions.setViewportPage, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridConfig: { ...state.gridConfig, page: action.page },
      };
    }),
    on(gridActions.setScrollIndex, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridSetting: { ...state.gridSetting, scrollIndex: action.scrollIndex },
      };
    }),
    on(gridActions.setColumnsConfig, (state, action) => {
      if (action.gridId !== gridName) return state;
      const columns = state.columnsConfig.map((column) =>
        column.name === action.columnsConfig.name ? { ...action.columnsConfig } : column,
      );
      return {
        ...state,
        columnsConfig: stickyEndMinWidth(columns, state.gridConfig, state.gridSetting),
      };
    }),
    on(gridActions.getData, gridActions.getConcatData, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridSetting: { ...state.gridSetting, loading: true },
      };
    }),
    on(gridActions.getDataSuccess, (state, action) => {
      if (action.gridId !== gridName) return state;
      const gridConfig = state.gridConfig;
      let queryData: unknown[] = gridConfig.rowGroupField && state.rowGroups ? [...state.queryData] : [...state.data];
      let data: unknown[] =
        gridConfig.virtualScroll && gridConfig.page > 1
          ? [...queryData, ...action.gridData.data]
          : [...action.gridData.data];
      let totalCounts = action.gridData.totalCounts;
      if (gridConfig.rowGroupField && state.rowGroups) {
        queryData = [...data];
        data = state.rowGroups.getRowGroups(data as GnroDataType[]);
        const groups = [...data].filter((record) => record instanceof GnroRowGroup);
        totalCounts += groups.length;
      }
      setSelection(gridConfig, state.selection.selection as SelectionModel<unknown>, data);
      return {
        ...state,
        gridSetting: {
          ...state.gridSetting,
          loading: false,
          totalCounts,
          lastUpdateTime: new Date(),
          restEdit: false,
          recordModified: false,
          columnUpdating: false,
        },
        totalCounts,
        data,
        queryData,
        modified: [],
        selection: getSelection(gridConfig, state.selection.selection as SelectionModel<unknown>, data),
      };
    }),
    on(formWindowActions.saveSuccess, (state, action) => {
      if (action.stateId !== gridName) return state;
      return {
        ...state,
        gridSetting: { ...state.gridSetting, recordModified: true },
      };
    }),
    on(gridActions.setLoadTreeDataLoading, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridSetting: {
          ...state.gridSetting,
          loading: action.loading,
          lastUpdateTime: new Date(),
          restEdit: false,
          recordModified: false,
          columnUpdating: false,
        },
      };
    }),
    on(gridActions.setInMemoryData, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridSetting: { ...state.gridSetting, totalCounts: action.gridData.totalCounts },
        totalCounts: action.gridData.totalCounts,
        inMemoryData: action.gridData.data as unknown[],
      };
    }),
    on(gridActions.setSelectAllRows, (state, action) => {
      if (action.gridId !== gridName) return state;
      const selection = state.selection.selection;
      if (action.selectAll) {
        const selectedRecords = state.data.filter((item) => item && !(item instanceof GnroRowGroup));
        selectedRecords.forEach((record) => selection.select(record));
      } else {
        selection.clear();
      }
      return {
        ...state,
        selection: getSelection(state.gridConfig, selection, state.data),
      };
    }),
    on(gridActions.setSelectRows, (state, action) => {
      if (action.gridId !== gridName) return state;
      const selection = state.selection.selection as SelectionModel<unknown>;
      action.records.forEach((record) => {
        if (action.isSelected) {
          selection.select(record as unknown);
        } else {
          selection.deselect(record as unknown);
        }
      });
      return {
        ...state,
        selection: getSelection(state.gridConfig, selection, state.data),
      };
    }),
    on(gridActions.setSelectRow, (state, action) => {
      if (action.gridId !== gridName) return state;
      const selection = state.selection.selection as SelectionModel<unknown>;
      selection.clear();
      selection.select(action.record as unknown);
      return {
        ...state,
        selection: getSelection(state.gridConfig, selection, state.data),
      };
    }),
    on(gridActions.setGroupBy, (state, action) => {
      if (action.gridId !== gridName) return state;
      const rowGroups = new GnroRowGroups();
      rowGroups.rowGroupFields = [action.rowGroupField];
      return {
        ...state,
        rowGroups,
        gridConfig: { ...state.gridConfig, rowGroupField: action.rowGroupField },
        queryData: [...state.data],
      };
    }),
    on(gridActions.setToggleRowGroup, (state, action) => {
      if (action.gridId !== gridName) return state;
      const queryData = [...state.queryData];
      const data = state.rowGroups!.getRowGroups(queryData);
      const groups = [...data].filter((record) => record instanceof GnroRowGroup);
      const totalCounts = queryData.length + groups.length;
      return {
        ...state,
        gridSetting: { ...state.gridSetting, totalCounts },
        totalCounts,
        data,
      };
    }),
    on(gridActions.setUnGroupBy, (state, action) => {
      if (action.gridId !== gridName) return state;
      const groups = [...state.data].filter((record) => record instanceof GnroRowGroup);
      const data = [...state.queryData];
      const total = state.totalCounts - groups.length;
      return {
        ...state,
        rowGroups: undefined,
        gridConfig: { ...state.gridConfig, rowGroupField: undefined },
        gridSetting: { ...state.gridSetting, totalCounts: total },
        totalCounts: total,
        data,
        queryData: [],
      };
    }),
    on(gridActions.setEditable, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridSetting: {
          ...state.gridSetting,
          gridEditable: action.gridEditable,
          restEdit: false,
          recordModified: false,
        },
        modified: [],
      };
    }),
    on(gridActions.setResetEdit, (state, action) => {
      if (action.gridId !== gridName) return state;
      return {
        ...state,
        gridSetting: { ...state.gridSetting, restEdit: action.restEdit, recordModified: false },
        modified: [],
      };
    }),
    on(gridActions.setRecordModified, (state, action) => {
      if (action.gridId !== gridName) return state;
      const modified = getModifiedRecords(state.modified as GnroDataType[], action.modified);
      return {
        ...state,
        gridSetting: { ...state.gridSetting, restEdit: false, recordModified: modified.length > 0 },
        modified: modified as unknown[],
      };
    }),
    on(gridActions.saveModifiedRecordsSuccess, (state, action) => {
      if (action.gridId !== gridName) return state;
      const recordKey = state.gridConfig.recordKey;
      const data = [...state.data].map((item) => {
        const keyId = (item as GnroDataType)[recordKey];
        const find = (action.newRecords as GnroDataType[]).find((record) => record[recordKey] === keyId);
        return find ? find : item;
      }) as unknown[];
      return {
        ...state,
        gridSetting: { ...state.gridSetting, recordModified: false },
        data,
        modified: [],
      };
    }),
    on(gridActions.removeStore, (state, action) => {
      if (action.gridId !== gridName) return state;
      return getInitialGridState<unknown>(gridName);
    }),
  );

  const reducerFn = (state: GnroGridState<unknown> | undefined, action: Action): GnroGridState<unknown> => {
    return gridReducer(state, action);
  };

  gridReducersByFeature.set(gridName, reducerFn);
  return reducerFn;
}
