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
import { GnroImportsConfig } from '../models/imports.model';

//only support one open dialog window at a time
export interface ImportsState {
  stateId: string;
  importedExcelData: GnroGridData<object>;
  columnsConfig: GnroColumnConfig[];
  importsConfig: GnroImportsConfig;
}

export const initialState: ImportsState = {
  stateId: '',
  importedExcelData: { data: [], totalCounts: 0 },
  columnsConfig: [],
  importsConfig: {
    keyId: '',
    keys: [],
    requiredKeys: [],
  },
};

function getImportStatus(arr: any[], importsConfig: GnroImportsConfig): object[] {
  const keys = importsConfig.keys;
  const keyId = importsConfig.keyId;
  const seenCombinations = new Map<string, number>();
  const duplicates: object[] = [];
  for (const obj of arr) {
    const keyParts = keys.map((key) => String(obj[key]));
    const compositeKey = keyParts.join('-');
    if (seenCombinations.has(compositeKey)) {
      duplicates.push(obj);
    } else {
      seenCombinations.set(compositeKey, 1);
    }
  }
  const excellData = arr.map((item, index) => {
    const keyParts = keys.map((key) => String(item[key]));
    const compositeKey = keyParts.join('-');
    const find = duplicates.find((data: any) => {
      const keyDups = keys.map((key) => String(data[key]));
      const compositeDup = keyDups.join('-');
      return compositeKey === compositeDup;
    });
    if (find) {
      return {
        ...item,
        ImportStatus: 'Duplicated',
      };
    } else {
      const keyIdValue = item[keyId];
      const ImportStatus = keyIdValue ? 'update' : 'add';
      return {
        ...item,
        ImportStatus,
      };
    }
  });
  return excellData;
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
      const imports = action.importsResponse;
      const data = getImportStatus(imports.importedExcelData.data, imports.importsConfig);
      return {
        ...state,
        importedExcelData: {
          data,
          totalCounts: data.length,
        },
        columnsConfig: imports.columnsConfig,
        importsConfig: imports.importsConfig,
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
      const excelData = importedExcelData.filter((item) => !selected.find((record) => isEqual(item, record)));
      const data = getImportStatus(excelData, state.importsConfig);
      return {
        ...state,
        importedExcelData: { data: data, totalCounts: data.length },
      };
    }),
  ),
});
