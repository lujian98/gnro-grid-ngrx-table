import { GnroObjectType, GrnoDataType } from '@gnro/ui/core';
import { formWindowActions } from '@gnro/ui/form-window';
import { createFeature, createReducer, on } from '@ngrx/store';
import { MIN_GRID_COLUMN_WIDTH, VIRTUAL_SCROLL_PAGE_SIZE } from '../models/constants';
import { defaultState } from '../models/default-grid';
import { GridState } from '../models/grid.model';
import { getFormFields } from '../utils/form-fields';
import { GnroRowGroup } from '../utils/row-group/row-group';
import { GnroRowGroups } from '../utils/row-group/row-groups';
import { getSelection, initSelection, setSelection } from '../utils/row-selection';
import { stickyEndMinWidth } from '../utils/viewport-width-ratio';
import { gridActions } from './grid.actions';

const initialState = <T>(): GridState<T> => ({});

export const gnroGridFeature = createFeature({
  name: 'gnroGrid',
  reducer: createReducer(
    initialState(),
    on(gridActions.initConfig, (state, action) => {
      const gridConfig = {
        ...action.gridConfig,
        //virtualScroll: action.gridConfig.virtualScroll || action.gridConfig.rowGroup,
      };
      const key = action.gridId;
      const newState = { ...state };
      newState[key] = {
        ...defaultState(),
        gridConfig: {
          ...gridConfig,
          pageSize: !gridConfig.virtualScroll ? gridConfig.pageSize : VIRTUAL_SCROLL_PAGE_SIZE,
          columnSticky: gridConfig.horizontalScroll ? gridConfig.columnSticky : false,
        },
        gridSetting: {
          ...defaultState().gridSetting,
          gridId: action.gridId,
          isTreeGrid: action.gridType === 'treeGrid',
          viewportReady: !gridConfig.remoteGridConfig && !gridConfig.remoteColumnsConfig,
        },
      };
      return { ...newState };
    }),
    on(gridActions.loadConfigSuccess, (state, action) => {
      const gridConfig = {
        ...action.gridConfig,
        //virtualScroll: action.gridConfig.virtualScroll || action.gridConfig.rowGroup,
      };
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridConfig: {
            ...gridConfig,
            columnSticky: gridConfig.horizontalScroll ? gridConfig.columnSticky : false,
          },
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
    on(gridActions.loadColumnsConfigSuccess, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const gridConfig = state[key].gridConfig;
        const gridSetting = state[key].gridSetting;
        const allowHide = action.columnsConfig.filter((col) => col.allowHide === false).length;
        const columns = action.columnsConfig.map((column, index) => {
          return {
            ...column,
            allowHide: allowHide === 0 && index === 0 ? false : column.allowHide,
            rendererType: column.rendererType || GnroObjectType.Text,
            width: column.width || MIN_GRID_COLUMN_WIDTH,
            sticky: gridSetting.isTreeGrid && column.name === 'name' ? true : column.sticky,
          };
        });

        const columnsConfig = stickyEndMinWidth(columns, gridConfig, state[key].gridSetting);
        const selection = initSelection(gridConfig, state[key].selection.selection);
        const formFields = getFormFields(gridConfig, columnsConfig);
        newState[key] = {
          ...state[key],
          gridSetting: {
            ...state[key].gridSetting,
            viewportReady: true,
            columnUpdating: true, //TODO not used remove??
          },
          columnsConfig,
          selection: getSelection(gridConfig, selection, state[key].data),
          formWindowConfig: {
            ...state[key].formWindowConfig,
            formConfig: {
              ...state[key].formWindowConfig.formConfig,
              urlKey: gridConfig.urlKey,
            },
            formFields,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.loadFormWindowConfigSuccess, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const formFields = action.formWindowConfig.formFields || [];
        const formWindowConfig = {
          ...action.formWindowConfig,
          formFields: formFields?.length === 0 ? state[key].formWindowConfig.formFields : formFields,
        };
        newState[key] = {
          ...state[key],
          formWindowConfig,
        };
      }
      return { ...newState };
    }),
    on(gridActions.setViewportPageSize, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const gridConfig = state[key].gridConfig;
        const pageSize = gridConfig.virtualScroll || gridConfig.verticalScroll ? gridConfig.pageSize : action.pageSize;
        const gridSetting = {
          ...state[key].gridSetting,
          viewportWidth: action.viewportWidth,
          viewportSize: action.pageSize,
        };
        const columnsConfig = stickyEndMinWidth(state[key].columnsConfig, gridConfig, gridSetting);
        newState[key] = {
          ...state[key],
          columnsConfig,
          gridConfig: {
            ...gridConfig,
            pageSize: pageSize,
          },
          gridSetting,
        };
      }
      return { ...newState };
    }),
    on(gridActions.setSortFields, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
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
    on(gridActions.setColumnFilters, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridConfig: {
            ...state[key].gridConfig,
            columnFilters: action.columnFilters,
            page: 1,
          },
          gridSetting: {
            ...state[key].gridSetting,
            columnUpdating: false,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.setViewportPage, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
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
    on(gridActions.setScrollIndex, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridSetting: {
            ...state[key].gridSetting,
            scrollIndex: action.scrollIndex,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.setColumnsConfig, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const columns = state[key].columnsConfig.map((column) => {
          if (column.name === action.columnsConfig.name) {
            return { ...action.columnsConfig };
          } else {
            return column;
          }
        });
        newState[key] = {
          ...state[key],
          columnsConfig: stickyEndMinWidth(columns, state[key].gridConfig, state[key].gridSetting),
        };
      }
      return { ...newState };
    }),
    on(gridActions.getData, gridActions.getConcatData, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridSetting: {
            ...state[key].gridSetting,
            loading: true,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.getDataSuccess, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const gridConfig = oldState.gridConfig;

        let queryData = gridConfig.rowGroupField && oldState.rowGroups ? [...oldState.queryData] : [...oldState.data];
        let data =
          gridConfig.virtualScroll && gridConfig.page > 1
            ? [...queryData, ...action.gridData.data]
            : [...action.gridData.data];

        let totalCounts = action.gridData.totalCounts;

        if (gridConfig.rowGroupField && oldState.rowGroups) {
          queryData = [...data];
          data = oldState.rowGroups.getRowGroups(data);
          const groups = [...data].filter((record) => record instanceof GnroRowGroup);
          totalCounts += groups.length;
        }

        setSelection(gridConfig, oldState.selection.selection, data);
        newState[key] = {
          ...oldState,
          gridSetting: {
            ...oldState.gridSetting,
            loading: false,
            totalCounts: totalCounts,
            lastUpdateTime: new Date(),
            restEdit: false,
            recordModified: false,
            columnUpdating: false,
          },
          totalCounts: totalCounts,
          data,
          queryData,
          modified: [],
          selection: getSelection(gridConfig, oldState.selection.selection, data),
        };
      }
      return { ...newState };
    }),
    on(formWindowActions.saveSuccess, (state, action) => {
      const key = action.stateId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        newState[key] = {
          ...oldState,
          gridSetting: {
            ...oldState.gridSetting,
            recordModified: true,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.setLoadTreeDataLoading, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        newState[key] = {
          ...state[key],
          gridSetting: {
            ...state[key].gridSetting,
            loading: action.loading,
            lastUpdateTime: new Date(),
            restEdit: false,
            recordModified: false,
            columnUpdating: false,
          },
        };
      }
      return { ...newState };
    }),
    on(gridActions.setInMemoryData, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
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
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const selection = oldState.selection.selection;
        if (action.selectAll) {
          const selectedRecords = oldState.data.filter((item) => item && !(item instanceof GnroRowGroup));
          selectedRecords.forEach((record) => selection.select(record));
        } else {
          selection.clear();
        }
        newState[key] = {
          ...oldState,
          selection: getSelection(oldState.gridConfig, selection, oldState.data),
        };
      }
      return { ...newState };
    }),
    on(gridActions.setSelectRows, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const selection = oldState.selection.selection;
        action.records.forEach((record) => {
          if (action.isSelected) {
            selection.select(record);
          } else {
            selection.deselect(record);
          }
        });
        newState[key] = {
          ...oldState,
          selection: getSelection(oldState.gridConfig, selection, oldState.data),
        };
      }
      return { ...newState };
    }),
    on(gridActions.setSelectRow, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const selection = oldState.selection.selection;
        selection.clear();
        selection.select(action.record);
        newState[key] = {
          ...oldState,
          selection: getSelection(oldState.gridConfig, selection, oldState.data),
        };
      }
      return { ...newState };
    }),
    on(gridActions.setGroupBy, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const rowGroups = new GnroRowGroups();
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
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const queryData = [...oldState.queryData];
        const data = oldState.rowGroups!.getRowGroups(queryData);
        const groups = [...data].filter((record) => record instanceof GnroRowGroup);
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
    on(gridActions.setUnGroupBy, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const groups = [...oldState.data].filter((record) => record instanceof GnroRowGroup);
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
    on(gridActions.setEditable, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
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
    on(gridActions.setResetEdit, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
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
    on(gridActions.setRecordModified, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const value = action.modified;
        let modified = [...oldState.modified] as GrnoDataType[];
        const find = modified.find((record) => record[value.recordKey] === value.recordId);
        if (find) {
          modified = [...modified].filter((record) => record[value.recordKey] !== value.recordId);
          if (value.changed) {
            (find as { [key: string]: unknown })[value.field] = value.value;
          } else {
            delete (find as { [key: string]: unknown })[value.field];
          }
          if (Object.keys(find).length > 1) {
            modified.push(find);
          }
        } else {
          const record = {
            [value.recordKey]: value.recordId,
            [value.field]: value.value,
          };
          //record[value.recordKey] = value.recordId;
          //record[value.field] = value.value;
          modified.push(record as GrnoDataType);
        }
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
      const newState = { ...state };
      if (state[key]) {
        const oldState = state[key];
        const recordKey = oldState.gridConfig.recordKey;
        const data = [...oldState.data].map((item) => {
          const keyId = (item as GrnoDataType)[recordKey];
          const find = (action.newRecords as GrnoDataType[]).find((record) => record[recordKey] === keyId);
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
    on(gridActions.removeStore, (state, action) => {
      const key = action.gridId;
      const newState = { ...state };
      if (state[key]) {
        delete newState[key];
      }
      return { ...newState };
    }),
  ),
});
