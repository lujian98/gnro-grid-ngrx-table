import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IccTextFieldComponent, IccTextFieldConfig, defaultTextFieldConfig } from '@icc/ui/fields';

@Component({
  selector: 'app-form3',
  template: `
    <icc-text-field [fieldConfig]="fieldConfig" [form]="form"> </icc-text-field>
    <div>Value List:</div>
    @for (value of values; track $index; let index = $index) {
      <div>{{ index + 1 }}: {{ value }}</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccTextFieldComponent, FormsModule, ReactiveFormsModule],
})
export class AppForm3Component implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  form!: FormGroup;
  private _values: string[] = [];

  @Input()
  set values(values: string[]) {
    this._values = values;
    this.changeDetectorRef.markForCheck();
  }
  get values(): string[] {
    return this._values;
  }

  fieldConfig: IccTextFieldConfig = {
    ...defaultTextFieldConfig,
    fieldName: 'fieldTest3',
    fieldLabel: 'Field Test 3',
    labelWidth: 60,
    clearValue: true,
    editable: true,
  };

  ngOnInit(): void {}
}
