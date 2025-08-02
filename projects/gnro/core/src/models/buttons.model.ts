export enum GnroButtonType {
  Add = 'Add',
  ClearAllFilters = 'ClearAllFilters',
  CollapseAll = 'CollapseAll',
  Delete = 'Delete',
  Edit = 'Edit',
  ExpandAll = 'ExpandAll',
  Export = 'Export',
  Open = 'Open',
  Refresh = 'Refresh',
  Remove = 'Remove',
  Reset = 'Reset',
  View = 'View',
  Save = 'Save',
  UploadFile = 'UploadFile',
}

export enum GnroButtonActionType {
  DELETE = 'Delete',
  DOWNLOAD = 'Download',
  EXPORT = 'Export',
  GET = 'Get',
  NEW = 'New',
  UPDATE = 'Update',
  UPLOADFILE = 'Uploadfile',
}

export interface GnroButtonConfg {
  name: string;
  title?: string;
  icon?: string;
  disabled?: boolean;
  hidden?: boolean;
  link?: string;
  remoteAction?: GnroButtonActionType;
}

export const GnroBUTTONS = {
  Add: {
    name: GnroButtonType.Add,
    title: 'GNRO.UI.ACTIONS.ADD',
    icon: 'plus',
    //remoteAction: GnroButtonActionType.NEW,
  },
  ClearAllFilters: {
    name: GnroButtonType.ClearAllFilters,
    title: 'GNRO.UI.ACTIONS.CLEAR_ALL_FILTERS',
    icon: 'pen-to-square', // TODO icon
  },
  CollapseAll: {
    name: GnroButtonType.CollapseAll,
    title: 'Collapse All',
    icon: 'plus',
  },
  Delete: {
    name: GnroButtonType.Delete,
    title: 'GNRO.UI.ACTIONS.DELETE',
    icon: 'minus',
  },
  Edit: {
    name: GnroButtonType.Edit,
    title: 'GNRO.UI.ACTIONS.EDIT',
    icon: 'pen-to-square',
  },
  ExpandAll: {
    name: GnroButtonType.ExpandAll,
    title: 'Expand All',
    icon: 'plus',
  },
  Export: {
    name: GnroButtonType.Export,
    title: 'GNRO.UI.ACTIONS.EXPORT',
    icon: 'plus',
  },
  Open: {
    name: GnroButtonType.Open,
    title: 'Open',
    icon: 'folder',
  },
  Remove: {
    name: GnroButtonType.Remove,
    title: 'GNRO.UI.ACTIONS.REMOVE',
    icon: 'trash',
  },
  Refresh: {
    name: GnroButtonType.Refresh,
    title: 'GNRO.UI.ACTIONS.REFRESH',
    icon: 'refresh',
  },
  Reset: {
    name: GnroButtonType.Reset,
    title: 'GNRO.UI.ACTIONS.RESET',
    icon: 'right-left',
  },
  Save: {
    name: GnroButtonType.Save,
    title: 'GNRO.UI.ACTIONS.SAVE',
    icon: 'floppy-disk',
  },
  UploadFile: {
    name: GnroButtonType.UploadFile,
    title: 'GNRO.UI.ACTIONS.UPLOAD_FILE',
    icon: 'pen-to-square', // TODO icon
  },
  View: {
    name: GnroButtonType.View,
    title: 'GNRO.UI.ACTIONS.VIEW',
    icon: 'glasses',
  },
};
