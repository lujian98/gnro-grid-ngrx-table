import { _IdGenerator } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  ChangeDetectorRef,
  computed,
  ContentChildren,
  DestroyRef,
  Directive,
  forwardRef,
  inject,
  InjectionToken,
  Input,
  input,
  model,
  output,
  QueryList,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GnroRadioChange, GnroRadioComponent } from './radio.component';

export const GNRO_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GnroRadioGroupDirective),
  multi: true,
};

export const GNRO_RADIO_GROUP = new InjectionToken<GnroRadioGroupDirective>('GnroRadioGroup');

@Directive({
  selector: 'gnro-radio-group',
  exportAs: 'gnroRadioGroup',
  providers: [
    GNRO_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
    { provide: GNRO_RADIO_GROUP, useExisting: GnroRadioGroupDirective },
  ],
  host: {
    role: 'radiogroup',
    class: 'gnro-mdc-radio-group',
  },
})
export class GnroRadioGroupDirective implements AfterContentInit, ControlValueAccessor {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private _value: any = null;
  private _selected: GnroRadioComponent | null = null;
  private _isInitialized: boolean = false;
  _controlValueAccessorChangeFn: (value: any) => void = () => {};
  onTouched: () => any = () => {};

  name = input<string>(inject(_IdGenerator).getId('gnro-radio-group-'));
  labelPosition = input<'before' | 'after'>('after');

  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
    }
  }
  @Input()
  get selected() {
    return this._selected;
  }
  set selected(selected: GnroRadioComponent | null) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();
  }
  private _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  disabled = model(false);
  disabled$ = computed(() => this.disabled());
  required = input(false);
  disabledInteractive = input(false);

  readonly change = output<GnroRadioChange>();
  @ContentChildren(forwardRef(() => GnroRadioComponent), { descendants: true })
  private radios!: QueryList<GnroRadioComponent>;

  ngAfterContentInit(): void {
    this._isInitialized = true;
    this.radios.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.selected && !this.radios.find((radio) => radio === this.selected)) {
        this._selected = null;
      }
    });
  }

  _touch(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private _updateSelectedRadioFromValue(): void {
    const isAlreadySelected = this._selected !== null && this._selected.value === this._value;

    if (this.radios && !isAlreadySelected) {
      this._selected = null;
      this.radios.forEach((radio) => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }

  _emitChangeEvent(): void {
    if (this._isInitialized) {
      this.change.emit(new GnroRadioChange(this._selected!, this._value));
    }
  }

  _markRadiosForCheck(): void {
    if (this.radios) {
      this.radios.forEach((radio) => radio._markForCheck());
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
    this.changeDetectorRef.markForCheck();
  }
}
