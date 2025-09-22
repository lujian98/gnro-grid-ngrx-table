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
      'Init Config': props<{ gridId: string; gridConfig: GnroGridConfig; gridType: string }>(),
      'Load Config': props<{ gridId: string; gridConfig: GnroGridConfig }>(),
      'Load Config Success': props<{ gridId: string; gridConfig: GnroGridConfig }>(),
      'Load Columns Config': props<{ gridId: string }>(),
      'Load Columns Config Success': props<{
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
      'Set Scroll Index': props<{ gridId: string; scrollIndex: number }>(),
      'Set Sort Fields': props<{
        gridId: string;
        gridConfig: GnroGridConfig;
        isTreeGrid: boolean;
        sortFields: GnroSortField[];
      }>(),
      'Set Column Filters': props<{
        gridId: string;
        gridConfig: GnroGridConfig;
        isTreeGrid: boolean;
        columnFilters: GnroColumnFilter[];
      }>(),
      'Set Columns Config': props<{ gridId: string; columnsConfig: GnroColumnConfig }>(),
      'Get Data': props<{ gridId: string }>(),
      'Get Concat Data': props<{ gridId: string }>(),
      'Get Data Success': props<{ gridId: string; gridData: GnroGridData<T> }>(),
      'Set In Memory Data': props<{ gridId: string; gridConfig: GnroGridConfig; gridData: GnroGridData<T> }>(),
      'Set Select All Rows': props<{ gridId: string; selectAll: boolean }>(),
      'Set Select Rows': props<{ gridId: string; records: T[]; isSelected: boolean; selected: number }>(),
      'Set Select Row': props<{ gridId: string; record: T }>(),
      'Set Group By': props<{ gridId: string; gridConfig: GnroGridConfig; rowGroupField: GnroRowGroupField }>(),
      'Set Toggle Row Group': props<{ gridId: string; rowGroup: GnroRowGroup }>(),
      'Set UnGroup By': props<{ gridId: string; gridConfig: GnroGridConfig }>(),
      'Set Editable': props<{ gridId: string; gridEditable: boolean }>(),
      'Set Record Modified': props<{ gridId: string; modified: GnroCellEdit<T> }>(),
      'Save Modified Records': props<{ gridId: string }>(),
      //TODO save return data or refresh data???
      'Save Modified Records Success': props<{ gridId: string; newRecords: T[] }>(),
      'Set Reset Edit': props<{ gridId: string; restEdit: boolean }>(),
      'Load Form Window Config Success': props<{ gridId: string; formWindowConfig: GnroFormWindowConfig }>(),
      'Set Load Tree Data Loading': props<{ gridId: string; loading: boolean }>(),
      'Save Configs': props<{ gridId: string }>(),
      'Save Configs Success': props<{ gridId: string }>(),
      'Clear Store': props<{ gridId: string }>(),
      'Remove Store': props<{ gridId: string }>(),
    },
  });
}
