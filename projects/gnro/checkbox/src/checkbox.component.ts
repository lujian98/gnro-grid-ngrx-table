import {
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GnroIconModule } from '@gnro/ui/icon';

@Directive({
  selector: '[ghost]',
  host: {
    '[class.ghost-checkbox]': 'ghostCheckbox',
  },
})
export class GhostCheckboxDirective {
  private ghostCheckbox: boolean = true;
}

@Component({
  selector: 'gnro-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  imports: [GnroIconModule],
  host: {
    '[class.selected]': 'selected',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GnroCheckboxComponent),
      multi: true,
    },
  ],
})
export class GnroCheckboxComponent implements ControlValueAccessor {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  checked$ = signal<boolean>(false);
  disabled$ = signal<boolean>(false);
  indeterminate$ = signal<boolean>(false);
  checked = input(false, {
    transform: (checked: boolean) => {
      this.checked$.set(checked);
      return checked;
    },
  });
  disabled = input(false, {
    transform: (disabled: boolean) => {
      this.disabled$.set(disabled);
      return disabled;
    },
  });
  indeterminate = input(false, {
    transform: (indeterminate: boolean) => {
      this.indeterminate$.set(indeterminate);
      return indeterminate;
    },
  });
  change = output<boolean>();

  @ViewChild('inputEl') inputEl!: ElementRef;

  protected onChange = (value: boolean) => {};
  protected onTouched = (value: boolean) => {};

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: boolean) => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled$.set(isDisabled);
  }

  writeValue(value: boolean): void {
    this.checked$.set(value);

    //Fix for issue where we reference .detectChanges
    //on a destroyed view (such as when toggling control
    //enabled/disabled from a parent form group)
    //https://github.com/SAP/fundamental-ngx/issues/2364
    if (!(this.changeDetectorRef as any).destroyed) {
      this.changeDetectorRef.detectChanges();
    }
  }

  updateValueAndIndeterminate(event: Event): void {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    this.checked$.set(input.checked);
    this.change.emit(this.checked$());
    this.onChange(this.checked$());
    this.indeterminate$.set(input.indeterminate);
  }

  focus(): void {
    this.inputEl.nativeElement.focus();
  }
}
