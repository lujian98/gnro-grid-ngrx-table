import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { isEqual, GnroObjectType, isNumeric } from '@gnro/ui/core';
import { GnroFormField, GnroNumberFieldConfig } from '@gnro/ui/fields';
import { take, timer } from 'rxjs';
import { GnroGridFacade } from '../../../../+state/grid.facade';
import { GnroCellEdit, GnroColumnConfig, GnroGridConfig, GnroGridSetting } from '../../../../models/grid.model';

@Component({
  selector: 'gnro-grid-cell-edit-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroCellEditBaseComponent<T> {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly gridFacade = inject(GnroGridFacade);
  private _gridConfig!: GnroGridConfig;
  private _gridSetting!: GnroGridSetting;
  private _column!: GnroColumnConfig;
  private _record!: T;
  form!: FormGroup;

  fieldConfig!: Partial<GnroFormField>;
  baseFieldConfig: Partial<GnroFormField> = { lineHeight: 20 };

  rowIndex!: number;

  set gridSetting(value: GnroGridSetting) {
    this._gridSetting = { ...value };
    if (this.gridSetting.restEdit) {
      this.resetField();
    }
    this.changeDetectorRef.markForCheck();
  }
  get gridSetting(): GnroGridSetting {
    return this._gridSetting;
  }

  set gridConfig(value: GnroGridConfig) {
    this._gridConfig = { ...value };
    this.checkField();
    this.changeDetectorRef.markForCheck();
  }
  get gridConfig(): GnroGridConfig {
    return this._gridConfig;
  }

  set column(val: GnroColumnConfig) {
    this._column = val;
    if (!this.form) {
      this.form = new FormGroup({
        [this.column.name]: new FormControl<T | null>(null),
      });
    }
  }
  get column(): GnroColumnConfig {
    return this._column;
  }

  get field(): FormControl {
    return this.form!.get(this.column.name) as FormControl;
  }

  set record(data: T) {
    this._record = data;
    this.resetField();
    this.changeDetectorRef.markForCheck();
  }
  get record(): T {
    return this._record;
  }

  get data(): T {
    const data = (this.record as { [index: string]: T })[this.column.name];
    if (this.fieldConfig.fieldType === GnroObjectType.Number && isNumeric(data as string | number)) {
      return (data as number).toFixed((this.fieldConfig as GnroNumberFieldConfig).decimals) as T;
    }
    return data;
  }

  get recordId(): string {
    return (this.record as { [index: string]: string })[this.gridConfig.recordKey];
  }
  checkField(): void {}

  resetField(): void {
    timer(10)
      .pipe(take(1))
      .subscribe(() => {
        this.field.setValue(this.data);
        this.field.markAsPristine();
      });
  }

  onValueChange(value: T | null): void {
    const changed = !isEqual(value, this.data);
    if (changed) {
      this.field.markAsDirty();
    } else {
      this.resetField();
    }
    const modified: GnroCellEdit<T> = {
      recordKey: this.gridConfig.recordKey,
      recordId: this.recordId,
      field: this.column.name,
      value: value!,
      originalValue: this.data,
      changed: changed,
    };
    // TODO debounce change
    this.gridFacade.setRecordModified(this.gridSetting.gridId, modified);
  }
}
