import { SelectionModel } from '@angular/cdk/collections';
import { Type } from '@angular/core';
import { GnroObjectType } from '@gnro/ui/core';
import { GnroDateRange, GnroFieldConfig } from '@gnro/ui/fields';
import { GnroFormWindowConfig } from '@gnro/ui/form-window';
import { GnroRowGroups } from '../utils/row-group/row-groups';

export interface GnroCellEdit<T> {
  recordKey: string;
  recordId: string;
  field: string;
  value: T;
  originalValue: T;
  changed: boolean;
}

export interface GnroGridCell<T> {
  gridConfig: GnroGridConfig;
  gridSetting: GnroGridSetting;
  rowIndex: number;
  column: GnroColumnConfig;
  record: T;
}

export interface GnroSortField {
  field: string;
  dir: string;
}

export interface GnroRowGroupField {
  field: string;
  dir: string;
}

export interface GnroGroupHeader {
  name: string;
  title?: string;
  field?: string;
  isGroupHeader?: boolean;
}

export interface ColumnMenuClick {
  column: GnroColumnConfig;
  event: MouseEvent;
}

export interface GnroGridConfig {
  urlKey: string; // Only for remote grid config and data
  columnSort: boolean;
  columnFilter: boolean;
  columnResize: boolean;
  columnReorder: boolean;
  columnMenu: boolean;
  columnHidden: boolean;
  recordKey: string; // need this for cell edit and row selection
  remoteGridConfig: boolean;
  remoteColumnsConfig: boolean;
  rowSelection: boolean;
  multiRowSelection: boolean;
  rowGroup: boolean;
  horizontalScroll: boolean;
  columnSticky: boolean;
  verticalScroll: boolean;
  virtualScroll: boolean;
  sortFields: GnroSortField[];
  columnFilters: GnroColumnFilter[];
  page: number; // used initial load for saved page
  pageSize: number; //used for vertical scroll
  remoteGridData: boolean;
  hideTopbar: boolean;
  hideGridFooter: boolean;
  rowHeight: number;
  headerHeight: number;
  rowGroupField?: GnroRowGroupField;
  groupHeader?: boolean;
  refreshRate: number;
  hasDetailView: boolean;
}

export interface GridState {
  [key: string]: GnroGridState;
}

export interface GnroGridSetting {
  // for internal grid setting
  gridId: string;
  isTreeGrid: boolean;
  loading: boolean;
  columnUpdating: boolean; // prevent filter fetch data when column changes
  viewportWidth: number;
  lastUpdateTime?: Date;
  gridEditable: boolean;
  restEdit: boolean;
  recordModified: boolean;
  viewportReady: boolean;
  totalCounts: number;
  scrollIndex: number;
  viewportSize: number;
}

export interface GnroGridRowSelections<T> {
  selection: SelectionModel<T>;
  selected: number;
  allSelected: boolean;
  indeterminate: boolean;
}

export interface GnroGridState<T extends object = object> {
  gridConfig: GnroGridConfig; // for external grid config
  gridSetting: GnroGridSetting; // for internal use only settings
  formWindowConfig: GnroFormWindowConfig; //use with hasDetailView to open form window edit or view data
  columnsConfig: GnroColumnConfig[];
  data: T[];
  totalCounts: number;
  inMemoryData: T[];
  selection: GnroGridRowSelections<T>;
  queryData: T[]; // for row group temporary data
  rowGroups?: GnroRowGroups; // row group will handle at client side data only and only with one level
  modified: { [key: string]: unknown }[];
}

export interface GnroGridConfigResponse {
  gridConfig: Partial<GnroGridConfig>;
}

export interface GnroColumnsConfigResponse {
  columnsConfig: GnroColumnConfig[];
}

export interface GnroGridData<T> {
  data: T[];
  totalCounts: number;
}

export interface GnroColumnWidth {
  name: string;
  width: number;
}

export type GnroFilterValueType =
  | string
  | number
  | boolean
  | Date
  | GnroDateRange
  | string[]
  | number[]
  | object[]
  | null;

export interface GnroColumnFilter {
  name: string;
  value: GnroFilterValueType;
}

export type GnroRendererType =
  | GnroObjectType.Component
  | GnroObjectType.Date
  | GnroObjectType.Function
  | GnroObjectType.Image
  | GnroObjectType.Number
  | GnroObjectType.Select
  | GnroObjectType.Text;

export type GnroFilterField =
  | GnroObjectType.DateRange
  | GnroObjectType.Number
  | GnroObjectType.Select
  | GnroObjectType.Text;

export interface GnroColumnConfig {
  name: string;
  title?: string;
  hidden?: boolean;
  allowHide?: boolean; // default is true
  width?: number;
  resizeable?: boolean; // default is true
  align?: string;
  draggable?: boolean; // default is true
  sortField?: boolean; // default is true
  filterField?: boolean | GnroFilterField;
  filterFieldConfig?: GnroFieldConfig;
  groupField?: boolean;
  groupHeader?: GnroGroupHeader;

  rendererType?: GnroRendererType;
  rendererFieldConfig?: GnroFieldConfig;
  component?: Type<unknown>; // renderer component
  renderer?: Function; // renderer function
  cellEditable?: boolean;
  sticky?: boolean;
  stickyEnd?: boolean;

  //menu?: boolean | GnroMenuConfig; // custom input column menu??
}
