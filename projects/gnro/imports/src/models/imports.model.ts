import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';

export interface GnroImportsConfig {
  keyId: string;
  keys: string[];
  requiredKeys: string[];
}

//TODO move to core
export interface GrnoDataType {
  [key: string]: string | number | boolean | object;
}

export interface GnroImportsResponse {
  importedExcelData: GnroGridData<GrnoDataType>;
  columnsConfig: GnroColumnConfig[];
  importsConfig: GnroImportsConfig;
}
