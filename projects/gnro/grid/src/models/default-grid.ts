import { SelectionModel } from '@angular/cdk/collections';
import { GnroGridConfig, GnroGridState, GnroGridSetting } from './grid.model';

export const defaultGridConfig: GnroGridConfig = {
  urlKey: 'grid', // Only for remote grid config and data
  columnSort: false,
  columnFilter: false,
  columnResize: false,
  columnReorder: false,
  columnMenu: false,
  recordKey: 'id', // used for cell edit
  columnHidden: false,
  remoteGridConfig: false,
  remoteColumnsConfig: false,
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
  rowHeight: 24, //px
  headerHeight: 32, //px
  refreshRate: 0, //seconds  min 5 seconds to have refresh the grid data
  hasDetailView: false,
};

export const defaultGridSetting: GnroGridSetting = {
  gridId: '191cf2bb6b8',
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

export const defaultState: GnroGridState = {
  gridConfig: defaultGridConfig,
  gridSetting: defaultGridSetting,
  columnsConfig: [],
  data: [],
  totalCounts: 0,
  inMemoryData: [],
  queryData: [],
  rowGroups: undefined,
  selection: {
    selection: new SelectionModel<object>(false, []),
    selected: 0,
    allSelected: false,
    indeterminate: false,
  },
  modified: [],
};
