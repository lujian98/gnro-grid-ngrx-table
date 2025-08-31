import { GnroGridData, GnroColumnConfig } from '@gnro/ui/grid';

export interface GnroImportsResponse {
  importedExcelData: GnroGridData<object>;
  columnsConfig: GnroColumnConfig[];
}
