export class GnroRowGroup {
  //level: number = 0; // Only support one level or use tree grid
  private _value: string = '';
  field: string = '';
  expanded: boolean = true;
  totalCounts = 0;

  set value(val: string) {
    this._value = val;
  }
  get value(): string {
    return this._value;
  }
}
