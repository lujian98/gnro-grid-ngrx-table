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
  input,
  model,
  output,
  QueryList,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GnroRadioChange, GnroRadioComponent } from './radio.component';

export const GNRO_RADIO_GROUP = new InjectionToken<GnroRadioGroupDirective>('GnroRadioGroup');

export const GNRO_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GnroRadioGroupDirective),
  multi: true,
};

@Directive({
  selector: 'gnro-radio-group',
  exportAs: 'gnroRadioGroup',
  providers: [
    GNRO_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
    { provide: GNRO_RADIO_GROUP, useExisting: GnroRadioGroupDirective },
  ],
  host: {
    role: 'radiogroup',
    class: 'mat-mdc-radio-group',
  },
})
export class GnroRadioGroupDirective implements AfterContentInit, ControlValueAccessor {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private _isInitialized: boolean = false;
  _controlValueAccessorChangeFn: (value: any) => void = () => {};
  onTouched: () => any = () => {};

  name = input(inject(_IdGenerator).getId('gnro-radio-group-'), {
    transform: (name: string) => {
      this._updateRadioButtonNames(name);
      return name;
    },
  });
  labelPosition = input('after', {
    transform: (labelPosition: 'before' | 'after') => {
      this._markRadiosForCheck();
      return labelPosition;
    },
  });
  value$ = signal<any>(null);
  value = input(null, {
    transform: (value: any) => {
      this.value$.set(value);
      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
      return value;
    },
  });
  selected$ = signal<GnroRadioComponent | null>(null);
  selected = input(null, {
    transform: (selected: GnroRadioComponent | null) => {
      this.selected$.set(selected);
      this.value$.set(selected ? selected.value() : null);
      this._checkSelectedRadioButton();
      return selected;
    },
  });
  disabled = model(false);
  disabled$ = computed(() => this.disabled());
  required = input(false);
  disabledInteractive = input(false);

  readonly change = output<GnroRadioChange>();
  @ContentChildren(forwardRef(() => GnroRadioComponent), { descendants: true })
  private _radios!: QueryList<GnroRadioComponent>;

  ngAfterContentInit(): void {
    this._isInitialized = true;
    this._radios.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.selected$() && !this._radios.find((radio) => radio === this.selected$())) {
        this.selected$.set(null);
      }
    });
  }

  _touch(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private _checkSelectedRadioButton(): void {
    if (this.selected$() && !this.selected$()?.checked$()) {
      this.selected$()!.checked$.set(true);
    }
  }

  private _updateRadioButtonNames(name: string): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.name.set(name);
        radio._markForCheck();
      });
    }
  }

  private _updateSelectedRadioFromValue(): void {
    //const isAlreadySelected = this.selected$() !== null && this.selected$()!.value() === this.value$();
    const isAlreadySelected = false;
    if (this._radios && !isAlreadySelected) {
      this.selected$.set(null);
      this.selected$()?.checked$.set(false);

      this._radios.forEach((radio) => {
        radio.checked$.set(this.value$() === radio.value());
        if (radio.checked$()) {
          this.selected$.set(radio);
        }
        // radio._markForCheck();
      });
      this._markRadiosForCheck();
    }
  }

  _emitChangeEvent(): void {
    if (this._isInitialized) {
      this.change.emit(new GnroRadioChange(this.selected$()!, this.value$()));
    }
  }

  _markRadiosForCheck(): void {
    if (this._radios) {
      this._radios.forEach((radio) => radio._markForCheck());
    }
  }

  writeValue(value: any): void {
    this.value$.set(value);
    this._updateSelectedRadioFromValue();
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.changeDetectorRef.markForCheck();
  }
}
