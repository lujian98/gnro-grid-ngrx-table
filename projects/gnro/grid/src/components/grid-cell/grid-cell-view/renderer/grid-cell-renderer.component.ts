import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { GnroColumnConfig, GnroGridConfig } from '../../../../models/grid.model';

@Component({
  selector: 'gnro-grid-cell-renderer',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.grid-cell-align-center]': 'align === "center"',
    '[class.grid-cell-align-right]': 'align === "right"',
  },
})
export class GnroGridCellRendererComponent<T> {
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _record!: T;

  gridConfig!: GnroGridConfig;
  rowIndex!: number;
  column!: GnroColumnConfig;

  set record(data: T) {
    this._record = data;
    this.changeDetectorRef.markForCheck();
  }
  get record(): T {
    return this._record;
  }

  get data(): T {
    return (this.record as { [index: string]: T })[this.column.name];
  }

  get align(): string {
    return this.column.align ? this.column.align : 'left';
  }

  get alignCenter() {
    return this.align === 'center';
  }

  get alignRight() {
    return this.align === 'right';
  }
}
