import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';

//TODO model to include ImportStatus
export interface GnroImportsResponse {
  importedExcelData: GnroGridData<object>;
  columnsConfig: GnroColumnConfig[];
  importsKeys: string[];
  requiredKeys: string[];
}
