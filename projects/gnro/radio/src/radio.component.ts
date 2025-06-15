import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'gnro-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroRadioComponent),
      multi: true,
    },
  ],
})
export class GnroRadioComponent implements ControlValueAccessor {
  checked$ = signal<boolean>(false);
  disabled$ = signal<boolean>(false);
  checked = input(false, {
    transform: (checked: boolean) => {
      this.checked$.set(checked);
      return checked;
    },
  });
  disabled = input(false, {
    transform: (disabled: boolean) => {
      this.checked$.set(disabled);
      return disabled;
    },
  });
  field = input.required<FormControl>();
  fieldName = input<string>('');
  value = input<string>('');
  name = input<string>('');
  required = input<boolean>(false);

  registerOnChange(fn: (value: boolean) => void): void {}

  registerOnTouched(fn: (value: boolean) => void): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.disabled$.set(isDisabled);
  }

  writeValue(value: boolean): void {
    this.checked$.set(value);
  }
}
