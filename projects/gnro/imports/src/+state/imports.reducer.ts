import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';
import { isEqual } from '@gnro/ui/core';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  importsFileSuccessAction,
  openRemoteImportsWindowAction,
  resetImportsDataAction,
  deleteImportsSelectedAction,
} from './imports.actions';

//only support one open dialog window at a time
export interface ImportsState {
  stateId: string;
  importedExcelData: GnroGridData<object>;
  columnsConfig: GnroColumnConfig[];
}

export const initialState: ImportsState = {
  stateId: '',
  importedExcelData: { data: [], totalCounts: 0 },
  columnsConfig: [],
};

export const gnroImportsFeature = createFeature({
  name: 'gnroImports',
  reducer: createReducer(
    initialState,
    on(openRemoteImportsWindowAction, (state, action) => {
      return {
        ...state,
        stateId: action.stateId,
      };
    }),
    on(importsFileSuccessAction, (state, action) => {
      return {
        ...state,
        importedExcelData: action.importedExcelData,
        columnsConfig: action.columnsConfig,
      };
    }),
    on(resetImportsDataAction, (state) => {
      return {
        ...state,
        importedExcelData: { data: [], totalCounts: 0 },
      };
    }),
    on(deleteImportsSelectedAction, (state, action) => {
      const importedExcelData = state.importedExcelData ? state.importedExcelData.data : [];
      const selected = action.selected;
      const data = importedExcelData.filter((item) => !selected.find((record) => isEqual(item, record)));
      return {
        ...state,
        importedExcelData: { data: data, totalCounts: data.length },
      };
    }),
  ),
});
