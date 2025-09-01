import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';

export interface GnroImportsConfig {
  keyId: string;
  keys: string[];
  requiredKeys: string[];
}

//TODO model to include ImportStatus
export interface GnroImportsResponse {
  importedExcelData: GnroGridData<object>;
  columnsConfig: GnroColumnConfig[];
  importsConfig: GnroImportsConfig;
}
