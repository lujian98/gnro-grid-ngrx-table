import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';
import { isEqual } from '@gnro/ui/core';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  importsFileSuccessAction,
  openRemoteImportsWindowAction,
  resetImportsDataAction,
  deleteImportsSelectedAction,
  saveImportsRecordsSuccessAction,
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

const checkKeys = ['make', 'model', 'OEPN', 'Ruitai'];

function findDuplicatesByMultipleKeys(arr: any[], keys: string[]): object[] {
  const seenCombinations = new Map<string, number>();
  const duplicates: object[] = [];

  for (const obj of arr) {
    // Create a unique key string from the specified keys
    const keyParts = keys.map((key) => String(obj[key]));
    const compositeKey = keyParts.join('-'); // Or any other reliable delimiter

    if (seenCombinations.has(compositeKey)) {
      // If the combination has been seen before, it's a duplicate
      duplicates.push(obj);
    } else {
      // Otherwise, add the combination to the seen tracker
      seenCombinations.set(compositeKey, 1);
    }
  }
  return duplicates;
}

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
      const duplicated = findDuplicatesByMultipleKeys(action.importedExcelData.data, checkKeys);
      console.log(' duplicated=', duplicated);
      return {
        ...state,
        importedExcelData: action.importedExcelData,
        columnsConfig: action.columnsConfig,
      };
    }),
    on(resetImportsDataAction, saveImportsRecordsSuccessAction, (state) => {
      return {
        ...state,
        importedExcelData: { data: [], totalCounts: 0 },
      };
    }),
    on(deleteImportsSelectedAction, (state, action) => {
      const importedExcelData = state.importedExcelData ? state.importedExcelData.data : [];
      const selected = action.selected;
      const data = importedExcelData.filter((item) => !selected.find((record) => isEqual(item, record)));
      const duplicated = findDuplicatesByMultipleKeys(data, checkKeys);
      console.log('dddd duplicated=', duplicated);
      return {
        ...state,
        importedExcelData: { data: data, totalCounts: data.length },
      };
    }),
  ),
});
