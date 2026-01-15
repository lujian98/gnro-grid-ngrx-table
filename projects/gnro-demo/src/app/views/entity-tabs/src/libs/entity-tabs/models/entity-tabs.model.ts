export interface AppEntityTab {
  id: string;
  name: string;
  title: string;
  values: object;
  originalValues: object;
  dirty: boolean;
  editing: boolean;
}
