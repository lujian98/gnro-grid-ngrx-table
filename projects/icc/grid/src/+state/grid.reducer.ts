import { createFeature, createReducer, on } from '@ngrx/store';
import { MIN_GRID_COLUMN_WIDTH, VIRTUAL_SCROLL_PAGE_SIZE } from '../models/constants';
import { SelectionModel } from '@angular/cdk/collections';
import { defaultState } from '../models/default-grid';
import { IccObjectType } from '@icc/ui/core';
import { GridState } from '../models/grid-column.model';
import { IccRowGroup } from '../services/row-group/row-group';
import { IccRowGroups } from '../services/row-group/row-groups';
import * as gridActions from './grid.actions';

export const initialState: GridState = {};

export const iccGridFeature = createFeature({
  name: 'iccGrid',
  reducer: createReducer(
    initialState,
    on(gridActions.initGridConfig, (state, action) => {
      const gridConfig = {
        ...action.gridConfig,
        //virtualScroll: action.gridConfig.virtualScroll || action.gridConfig.rowGroup,
      };
      const key = action.gridId;
      const newState: GridState = { ...state };
      newState[key] = {
        ...defaultState,
        gridConfig: {
          ...gridConfig,
          pageSize: !gridConfig.virtualScroll ? gridConfig.pageSize : VIRTUAL_SCROLL_PAGE_SIZE,
        },
        gridSetting: {
          ...defaultState.gridSetting,
          gridId: action.gridId,
          isTreeGrid: action.gridType === 'treeGrid',
          viewportReady: !gridConfig.remoteGridConfig && !gridConfig.remoteColumnsConfig,
        },
      };
      return { ...newState };
    }),
    on(gridActions.loadGridConfigSuccess, (state, action) => {
      const gridConfig = {
        ...action.gridConfig,
        //virtualScroll: action.gridConfig.virtualScroll || action.gridConfig.rowGroup,
      };
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridConfig,
          gridSetting: {
            ...state[key].gridSetting,
            viewportReady: !action.gridConfig.remoteColumnsConfig,
          },
        };
        const pageSize = newState[key].gridConfig.pageSize;
        if (gridConfig.virtualScroll && pageSize < VIRTUAL_SCROLL_PAGE_SIZE) {
          newState[key].gridConfig.pageSize = VIRTUAL_SCROLL_PAGE_SIZE;
        }
      }
      return { ...newState };
    }),
    on(gridActions.loadGridColumnsConfigSuccess, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const gridConfig = state[key].gridConfig;
        newState[key] = {
          ...state[key],
          gridSetting: {
            ...state[key].gridSetting,
            viewportReady: true,
          },
          columnsConfig: action.columnsConfig.map((column) => {
            return {
              ...column,
              rendererType: column.rendererType || IccObjectType.Text,
              width: column.width || MIN_GRID_COLUMN_WIDTH,
            };
          }),
          selection: gridConfig.multiRowSelection ? new SelectionModel<object>(true, []) : state[key].selection,
        };
      }
      return { ...newState };
    }),
    on(gridActions.setViewportPageSize, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridConfig: {
            ...state[key].gridConfig,
            pageSize: action.pageSize,
          },
          gridSetting: {
            ...state[key].gridSetting,
            viewportWidth: action.viewportWidth,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGridSortFields, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridConfig: {
            ...state[key].gridConfig,
            sortFields: action.sortFields,
            page: 1,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGridColumnFilters, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridConfig: {
            ...state[key].gridConfig,
            columnFilters: action.columnFilters,
            page: 1,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.setViewportPage, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridConfig: {
            ...state[key].gridConfig,
            page: action.page,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGridColumnsConfig, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          columnsConfig: state[key].columnsConfig.map((column) => {
            if (column.name === action.columnsConfig.name) {
              return { ...action.columnsConfig };
            } else {
              return column;
            }
          }),
        };
      }
      return { ...newState };
    }),
    on(gridActions.getGridDataSuccess, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const gridConfig = oldState.gridConfig;
        if (oldState.selection.hasValue()) {
          oldState.selection?.clear();
        }

        let queryData = gridConfig.rowGroupField && oldState.rowGroups ? [...oldState.queryData] : [...oldState.data];
        let data =
          gridConfig.virtualScroll && gridConfig.page > 1
            ? [...queryData, ...action.gridData.data]
            : [...action.gridData.data];

        let totalCounts = action.gridData.totalCounts;

        if (gridConfig.rowGroupField && oldState.rowGroups) {
          queryData = [...data];
          data = oldState.rowGroups.getRowGroups(data);
          const groups = [...data].filter((record) => record instanceof IccRowGroup);
          totalCounts += groups.length;
        }

        newState[key] = {
          ...oldState,
          //gridConfig,
          gridSetting: {
            ...oldState.gridSetting,
            totalCounts: totalCounts,
            lastUpdateTime: new Date(),
            restEdit: false,
            recordModified: false,
          },
          totalCounts: totalCounts,
          data,
          queryData,
          modified: [],
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGridInMemoryData, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridSetting: {
            ...state[key].gridSetting,
            totalCounts: action.gridData.totalCounts,
          },
          totalCounts: action.gridData.totalCounts,
          inMemoryData: action.gridData.data,
        };
      }
      return { ...newState };
    }),

    on(gridActions.setSelectAllRows, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const selection = oldState.selection;
        if (action.selectAll) {
          oldState.data
            .filter((item) => item && !(item instanceof IccRowGroup))
            .forEach((record) => selection.select(record));
        } else {
          selection.clear();
        }
        newState[key] = {
          ...oldState,
        };
      }
      return { ...newState };
    }),

    on(gridActions.setSelectRows, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const selection = oldState.selection;
        action.records.forEach((record) => {
          if (action.select) {
            selection.select(record);
          } else {
            selection.deselect(record);
          }
        });
        newState[key] = {
          ...oldState,
        };
      }
      return { ...newState };
    }),

    on(gridActions.setSelectRow, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const selection = oldState.selection;
        selection.clear();
        selection.select(action.record);
        newState[key] = {
          ...oldState,
        };
      }
      return { ...newState };
    }),

    on(gridActions.setGridGroupBy, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const rowGroups = new IccRowGroups();
        rowGroups.rowGroupFields = [action.rowGroupField];
        newState[key] = {
          ...oldState,
          rowGroups,
          gridConfig: {
            ...oldState.gridConfig,
            rowGroupField: action.rowGroupField,
          },
          queryData: [...oldState.data],
        };
      }
      return { ...newState };
    }),
    on(gridActions.setToggleRowGroup, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const queryData = [...oldState.queryData];
        const data = oldState.rowGroups!.getRowGroups(queryData);
        const groups = [...data].filter((record) => record instanceof IccRowGroup);
        const totalCounts = queryData.length + groups.length;

        newState[key] = {
          ...oldState,
          gridSetting: {
            ...oldState.gridSetting,
            totalCounts: totalCounts,
          },
          totalCounts: totalCounts,
          data,
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGridUnGroupBy, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const groups = [...oldState.data].filter((record) => record instanceof IccRowGroup);
        const data = [...oldState.queryData];
        const total = oldState.totalCounts - groups.length;
        newState[key] = {
          ...oldState,
          rowGroups: undefined,
          gridConfig: {
            ...oldState.gridConfig,
            rowGroupField: undefined,
          },
          gridSetting: {
            ...oldState.gridSetting,
            totalCounts: total,
          },
          totalCounts: total,
          data: data,
          queryData: [],
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGridEditable, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        newState[key] = {
          ...oldState,
          gridSetting: {
            ...oldState.gridSetting,
            gridEditable: action.gridEditable,
            restEdit: false,
            recordModified: false,
          },
          modified: [],
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGridRestEdit, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        newState[key] = {
          ...oldState,
          gridSetting: {
            ...oldState.gridSetting,
            restEdit: action.restEdit,
            recordModified: false,
          },
          modified: [],
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGridRecordModified, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const value = action.modified;
        let modified = [...oldState.modified];
        const find = modified.find((record: { [key: string]: unknown }) => record[value.recordKey] === value.recordId);
        if (find) {
          modified = [...modified].filter(
            (record: { [key: string]: unknown }) => record[value.recordKey] !== value.recordId,
          );
          if (value.changed) {
            (find as { [key: string]: unknown })[value.field] = value.value;
          } else {
            delete (find as { [key: string]: unknown })[value.field];
          }
          if (Object.keys(find).length > 1) {
            modified.push(find);
          }
        } else {
          const record: { [index: string]: unknown } = {};
          record[value.recordKey] = value.recordId;
          record[value.field] = value.value;
          modified.push(record);
        }
        //console.log( ' new modified=', modified)
        newState[key] = {
          ...oldState,
          gridSetting: {
            ...oldState.gridSetting,
            restEdit: false,
            recordModified: modified.length > 0,
          },
          modified,
        };
      }
      return { ...newState };
    }),

    on(gridActions.saveModifiedRecordsSuccess, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const recordKey = oldState.gridConfig.recordKey;
        const data = [...oldState.data].map((item) => {
          const keyId = (item as { [key: string]: unknown })[recordKey];
          const find = action.newRecords.find((record) => record[recordKey] === keyId);
          return find ? find : item;
        });
        newState[key] = {
          ...oldState,
          gridSetting: {
            ...oldState.gridSetting,
            recordModified: false,
          },
          data,
          modified: [],
        };
      }
      return { ...newState };
    }),

    on(gridActions.removeGridDataStore, (state, action) => {
      const key = action.gridId;
      const newState: GridState = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
