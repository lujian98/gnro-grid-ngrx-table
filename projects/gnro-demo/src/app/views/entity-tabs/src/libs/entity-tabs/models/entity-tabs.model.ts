export interface AppEntityTab {
  id: string; // string or number
  name: string; // string may not needed if title is provided
  title: string; // title of the tab
  values: object; // form values
  originalValues: object; // original form values may used for comparison
  dirty: boolean; // true if the tab form is dirty
  editing: boolean; // true if the tab form is being edited
  valid: boolean; // true if the tab form is valid
}
