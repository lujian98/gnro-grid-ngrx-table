import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  GnroCellEdit,
  GnroColumnConfig,
  GnroColumnFilter,
  GnroGridConfig,
  GnroGridData,
  GnroRowGroupField,
  GnroSortField,
} from '../models/grid.model';
import { GnroRowGroup } from '../utils/row-group/row-group';
import { GnroFormWindowConfig } from '@gnro/ui/form-window';

export const gridActions = createActionGroup({
  source: '[Grid]',
  events: {
    'Init Grid Config': props<{ gridId: string; gridConfig: GnroGridConfig; gridType: string }>(),
    'Load Grid Config': props<{ gridId: string; gridConfig: GnroGridConfig }>(),
    'Load Grid Config Success': props<{ gridId: string; gridConfig: GnroGridConfig }>(),
    'Load Grid Columns Config': props<{ gridId: string }>(),
    'Load Grid Columns Config Success': props<{
      gridId: string;
      gridConfig: GnroGridConfig;
      isTreeGrid: boolean;
      columnsConfig: GnroColumnConfig[];
    }>(),
    'Set Viewport Page Size': props<{
      gridId: string;
      gridConfig: GnroGridConfig;
      pageSize: number;
      viewportWidth: number;
    }>(),
    'Set Viewport Page': props<{ gridId: string; page: number }>(),
    'Set Grid Scroll Index': props<{ gridId: string; scrollIndex: number }>(),
    'Set Grid Sort Fields': props<{
      gridId: string;
      gridConfig: GnroGridConfig;
      isTreeGrid: boolean;
      sortFields: GnroSortField[];
    }>(),
    'Set Grid Column Filters': props<{
      gridId: string;
      gridConfig: GnroGridConfig;
      isTreeGrid: boolean;
      columnFilters: GnroColumnFilter[];
    }>(),
    'Set Grid Columns Config': props<{ gridId: string; columnsConfig: GnroColumnConfig }>(),
    'Get Grid Data': props<{ gridId: string }>(),
    'Get Concat Grid Data': props<{ gridId: string }>(),
    'Get Grid Data Success': props<{ gridId: string; gridData: GnroGridData<object> }>(),
    'Set Grid In Memory Data': props<{ gridId: string; gridConfig: GnroGridConfig; gridData: GnroGridData<object> }>(),
    'Set Select All Rows': props<{ gridId: string; selectAll: boolean }>(),
    'Set Select Rows': props<{ gridId: string; records: object[]; isSelected: boolean; selected: number }>(),
    'Set Select Row': props<{ gridId: string; record: object }>(),
    'Set Grid Group By': props<{ gridId: string; gridConfig: GnroGridConfig; rowGroupField: GnroRowGroupField }>(),
    'Set Toggle Row Group': props<{ gridId: string; rowGroup: GnroRowGroup }>(),
    'Set Grid UnGroup By': props<{ gridId: string; gridConfig: GnroGridConfig }>(),
    'Set GridEditable': props<{ gridId: string; gridEditable: boolean }>(),
    'Set Grid Record Modified': props<{ gridId: string; modified: GnroCellEdit<unknown> }>(),
    'Save Grid Modified Records': props<{ gridId: string }>(),
    //TODO save return data or refresh data???
    'Save Modified Records Success': props<{ gridId: string; newRecords: { [key: string]: unknown }[] }>(),
    'Set Grid Rest Edit': props<{ gridId: string; restEdit: boolean }>(),
    'Load Form Window Config Success': props<{ gridId: string; formWindowConfig: GnroFormWindowConfig }>(),
    'Set Load Tree Data Loading': props<{ gridId: string; loading: boolean }>(),
    'Save Grid Configs': props<{ gridId: string }>(),
    'Save Grid Configs Success': props<{ gridId: string }>(),
    'Clear Store': props<{ gridId: string }>(),
    'Remove Store': props<{ gridId: string }>(),
  },
});

/*


export const initGridConfig = createAction(
  '[Grid] Init Grid Config',
  props<{ gridId: string; gridConfig: GnroGridConfig; gridType: string }>(),
);
export const loadGridConfig = createAction(
  '[Grid] Load Grid Config',
  props<{ gridId: string; gridConfig: GnroGridConfig }>(),
);
export const loadGridConfigSuccess = createAction(
  '[Grid] Load Grid Config Success',
  props<{ gridId: string; gridConfig: GnroGridConfig }>(),
);
export const loadGridColumnsConfig = createAction('[Grid] Load Grid Columns Config', props<{ gridId: string }>());
export const loadGridColumnsConfigSuccess = createAction(
  '[Grid] Load Grid Columns Config Success',
  props<{ gridId: string; gridConfig: GnroGridConfig; isTreeGrid: boolean; columnsConfig: GnroColumnConfig[] }>(),
);
export const setViewportPageSize = createAction(
  '[Grid] Setup Grid Viewport Page Size',
  props<{ gridId: string; gridConfig: GnroGridConfig; pageSize: number; viewportWidth: number }>(),
);
export const setViewportPage = createAction(
  '[Grid] Setup Grid Viewport Page',
  props<{ gridId: string; page: number }>(),
);
export const setGridScrollIndex = createAction(
  '[Grid] Setup Grid Scroll Index',
  props<{ gridId: string; scrollIndex: number }>(),
);
export const setGridSortFields = createAction(
  '[Grid] Set Grid Sort Fields',
  props<{ gridId: string; gridConfig: GnroGridConfig; isTreeGrid: boolean; sortFields: GnroSortField[] }>(),
);
export const setGridColumnFilters = createAction(
  '[Grid] Set Grid Column Filters',
  props<{ gridId: string; gridConfig: GnroGridConfig; isTreeGrid: boolean; columnFilters: GnroColumnFilter[] }>(),
);
export const setGridColumnsConfig = createAction(
  '[Grid] Setup Grid Column Config',
  props<{ gridId: string; columnsConfig: GnroColumnConfig }>(),
);
export const getGridData = createAction('[Grid] Get Grid Data', props<{ gridId: string }>());
export const getConcatGridData = createAction('[Grid] Get Concat Grid Data', props<{ gridId: string }>());
export const getGridDataSuccess = createAction(
  '[Grid] Get Grid Data Success',
  props<{ gridId: string; gridData: GnroGridData<object> }>(),
);
export const setGridInMemoryData = createAction(
  '[Grid] Get Grid In Memory Data',
  props<{ gridId: string; gridConfig: GnroGridConfig; gridData: GnroGridData<object> }>(),
);
export const setSelectAllRows = createAction(
  '[Grid] Setup Grid Set Select or Unselect All Rows',
  props<{ gridId: string; selectAll: boolean }>(),
);
export const setSelectRows = createAction(
  '[Grid] Setup Grid Set Select or Unselect Rows',
  props<{ gridId: string; records: object[]; isSelected: boolean; selected: number }>(),
);
export const setSelectRow = createAction(
  '[Grid] Setup Grid Set Select a Row and clear all other rows',
  props<{ gridId: string; record: object }>(),
);
export const setGridGroupBy = createAction(
  '[Grid] Setup Grid Group By a Column',
  props<{ gridId: string; gridConfig: GnroGridConfig; rowGroupField: GnroRowGroupField }>(),
);
export const setToggleRowGroup = createAction(
  '[Grid] Setup Grid Toggle Row Group',
  props<{ gridId: string; rowGroup: GnroRowGroup }>(),
);
export const setGridUnGroupBy = createAction(
  '[Grid] Setup Grid UnGroup By a Column',
  props<{ gridId: string; gridConfig: GnroGridConfig }>(),
);
export const setGridEditable = createAction(
  '[Grid] Setup Grid Set Grid Editable',
  props<{ gridId: string; gridEditable: boolean }>(),
);
export const setGridRecordModified = createAction(
  '[Grid] Setup Grid Set Grid Record Modified',
  props<{ gridId: string; modified: GnroCellEdit<unknown> }>(),
);
export const saveGridModifiedRecords = createAction('[Grid] Save Grid Modified Record', props<{ gridId: string }>());

//TODO save return data or refresh data???
export const saveModifiedRecordsSuccess = createAction(
  '[Grid] Save Grid Modified Record Success',
  props<{ gridId: string; newRecords: { [key: string]: unknown }[] }>(),
);

export const setGridRestEdit = createAction(
  '[Grid] Setup Grid Set Rest Edit',
  props<{ gridId: string; restEdit: boolean }>(),
);
export const loadFormWindowConfigSuccess = createAction(
  '[Grid] Load Grid Form Window Config Success',
  props<{ gridId: string; formWindowConfig: GnroFormWindowConfig }>(),
);
export const setLoadTreeDataLoading = createAction(
  '[Grid] Set Load Tree Data Loading ',
  props<{ gridId: string; loading: boolean }>(),
);
export const saveGridConfigs = createAction('[Grid] Save Config', props<{ gridId: string }>());
export const saveGridConfigsSuccess = createAction('[Grid] Save Config Success', props<{ gridId: string }>());

export const clearGridDataStore = createAction('[Grid] Clear Grid Data Store', props<{ gridId: string }>());

export const removeGridDataStore = createAction('[Grid] Remove Grid Data Store', props<{ gridId: string }>());

*/
