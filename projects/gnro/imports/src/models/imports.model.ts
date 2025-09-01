import { GrnoDataType } from '@gnro/ui/core';
import { GnroColumnConfig, GnroGridData } from '@gnro/ui/grid';

export interface GnroImportsConfig {
  keyId: string;
  keys: string[];
  requiredKeys: string[];
}

export interface GnroImportsResponse {
  importedExcelData: GnroGridData<GrnoDataType>;
  columnsConfig: GnroColumnConfig[];
  importsConfig: GnroImportsConfig;
}
