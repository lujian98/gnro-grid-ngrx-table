import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';

//TODO model to include ImportStatus
export interface GnroImportsResponse {
  importedExcelData: GnroGridData<object>;
  columnsConfig: GnroColumnConfig[];
  importskeyId: string;
  importsKeys: string[];
  requiredKeys: string[];
}
