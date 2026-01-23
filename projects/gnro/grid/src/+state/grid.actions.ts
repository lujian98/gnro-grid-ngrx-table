import { GnroFormWindowConfig } from '@gnro/ui/form-window';
import { createActionGroup, props } from '@ngrx/store';
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

export const gridActions = createGridActions();

function createGridActions<T>() {
  return createActionGroup({
    source: 'Grid',
    events: {
      'Init Config': props<{ gridName: string; gridConfig: GnroGridConfig; gridType: string }>(),
      'Load Config': props<{ gridName: string; gridConfig: GnroGridConfig }>(),
      'Load Config Success': props<{ gridName: string; gridConfig: GnroGridConfig }>(),
      'Load Columns Config': props<{ gridName: string }>(),
      'Load Columns Config Success': props<{
        gridName: string;
        gridConfig: GnroGridConfig;
        isTreeGrid: boolean;
        columnsConfig: GnroColumnConfig[];
      }>(),
      'Set Viewport Page Size': props<{
        gridName: string;
        gridConfig: GnroGridConfig;
        pageSize: number;
        viewportWidth: number;
      }>(),
      'Set Viewport Page': props<{ gridName: string; page: number }>(),
      'Set Scroll Index': props<{ gridName: string; scrollIndex: number }>(),
      'Set Sort Fields': props<{
        gridName: string;
        gridConfig: GnroGridConfig;
        isTreeGrid: boolean;
        sortFields: GnroSortField[];
      }>(),
      'Set Column Filters': props<{
        gridName: string;
        gridConfig: GnroGridConfig;
        isTreeGrid: boolean;
        columnFilters: GnroColumnFilter[];
      }>(),
      'Set Columns Config': props<{ gridName: string; columnsConfig: GnroColumnConfig }>(),
      'Get Data': props<{ gridName: string }>(),
      'Get Concat Data': props<{ gridName: string }>(),
      'Get Data Success': props<{ gridName: string; gridData: GnroGridData<T> }>(),
      'Set In Memory Data': props<{ gridName: string; gridConfig: GnroGridConfig; gridData: GnroGridData<T> }>(),
      'Set Select All Rows': props<{ gridName: string; selectAll: boolean }>(),
      'Set Select Rows': props<{ gridName: string; records: T[]; isSelected: boolean; selected: number }>(),
      'Set Select Row': props<{ gridName: string; record: T }>(),
      'Set Group By': props<{ gridName: string; gridConfig: GnroGridConfig; rowGroupField: GnroRowGroupField }>(),
      'Set Toggle Row Group': props<{ gridName: string; rowGroup: GnroRowGroup }>(),
      'Set UnGroup By': props<{ gridName: string; gridConfig: GnroGridConfig }>(),
      'Set Editable': props<{ gridName: string; gridEditable: boolean }>(),
      'Set Record Modified': props<{ gridName: string; modified: GnroCellEdit<T> }>(),
      'Save Modified Records': props<{ gridName: string }>(),
      //TODO save return data or refresh data???
      'Save Modified Records Success': props<{ gridName: string; newRecords: T[] }>(),
      'Set Reset Edit': props<{ gridName: string; restEdit: boolean }>(),
      'Load Form Window Config Success': props<{ gridName: string; formWindowConfig: GnroFormWindowConfig }>(),
      'Set Load Tree Data Loading': props<{ gridName: string; loading: boolean }>(),
      'Save Configs': props<{ gridName: string }>(),
      'Save Configs Success': props<{ gridName: string }>(),
      'Clear Store': props<{ gridName: string }>(),
      'Remove Store': props<{ gridName: string }>(),
    },
  });
}
