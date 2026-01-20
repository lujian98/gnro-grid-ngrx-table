export interface AppEntityTab {
  id: string; // string or number
  title: string; // title of the tab
  values: Record<string, unknown>; // form values
  originalValues: Record<string, unknown>; // original form values may used for comparison
  dirty: boolean; // true if the tab form is dirty
  editing: boolean; // true if the tab form is being edited
  invalid: boolean; // true if the tab form is invalid
  subtabIndex: number; // index of the subtab
}
