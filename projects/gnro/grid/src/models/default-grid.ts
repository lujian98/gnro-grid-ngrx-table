import { SelectionModel } from '@angular/cdk/collections';
import { GnroGridConfig, GnroGridState, GnroGridSetting } from './grid.model';

export const defaultGridConfig: GnroGridConfig = {
  gridName: 'grid', // Grid identifier, also used for remote grid config and data
  urlKey: '',
  columnSort: false,
  columnFilter: false,
  columnResize: false,
  columnReorder: false,
  columnMenu: false,
  recordKey: 'id', // used for cell edit
  columnHidden: false,
  remoteGridConfig: false,
  saveGridConfig: false,
  remoteColumnsConfig: false,
  saveColumnsConfig: false,
  rowSelection: false,
  multiRowSelection: false,
  rowGroup: false,
  groupHeader: false,
  horizontalScroll: false,
  columnSticky: false,
  verticalScroll: false,
  virtualScroll: false,
  sortFields: [],
  columnFilters: [],
  page: 1,
  pageSize: 10,
  remoteGridData: false,
  hideTopbar: false,
  hideGridFooter: false,
  hideFooterPage: false,
  rowHeight: 24, //px
  headerHeight: 32, //px
  refreshRate: 0, //seconds  min 5 seconds to have refresh the grid data
  hasDetailView: false,
};

export const defaultGridSetting: GnroGridSetting = {
  isTreeGrid: false,
  loading: true,
  columnUpdating: false,
  viewportReady: false,
  viewportWidth: 1000,
  //lastUpdateTime: new Date(),
  gridEditable: false,
  restEdit: false,
  recordModified: false,
  totalCounts: 0,
  scrollIndex: 0,
  viewportSize: 25,
};

export function defaultState<T>(): GnroGridState<T> {
  return {
    gridConfig: defaultGridConfig,
    gridSetting: defaultGridSetting,
    columnsConfig: [],
    formWindowConfig: {
      windowConfig: {
        title: 'Grid Form Window',
        showHeader: true,
        closable: true,
        dragDisabled: false,
        maximizable: true,
        resizeable: true,
        width: '800px',
      },
      formConfig: {
        labelWidth: 150,
      },
      formFields: [],
    },
    data: [],
    totalCounts: 0,
    inMemoryData: [],
    queryData: [],
    rowGroups: undefined,
    selection: {
      selection: new SelectionModel<T>(false, []),
      selected: 0,
      allSelected: false,
      indeterminate: false,
    },
    modified: [],
  };
}
