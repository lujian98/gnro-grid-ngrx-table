import { _IdGenerator } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  OnDestroy,
  output,
  QueryList,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GNRO_RADIO_GROUP, GNRO_RADIO_GROUP_CONTROL_VALUE_ACCESSOR } from './radio-group.model';
import { GnroRadioChange, GnroRadioComponent } from './radio.component';

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
export class GnroRadioGroupDirective implements AfterContentInit, OnDestroy, ControlValueAccessor {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private _isInitialized: boolean = false;
  private _buttonChanges!: Subscription;
  _controlValueAccessorChangeFn: (value: any) => void = () => {};
  onTouched: () => any = () => {};

  @ContentChildren(forwardRef(() => GnroRadioComponent), { descendants: true })
  private _radios!: QueryList<GnroRadioComponent>;

  name = input(inject(_IdGenerator).getId('gnro-radio-group-'), {
    transform: (name: string) => {
      this._updateRadioButtonNames();
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
      this.value$.set(selected ? selected.value : null);
      this._checkSelectedRadioButton();
      return selected;
    },
  });
  disabled$ = signal<boolean>(false);
  disabled = input(false, {
    transform: (disabled: boolean) => {
      this.disabled$.set(disabled);
      this._markRadiosForCheck();
      return disabled;
    },
  });
  required = input(false, {
    transform: (required: boolean) => {
      this._markRadiosForCheck();
      return required;
    },
  });
  disabledInteractive = input(false, {
    transform: (disabledInteractive: boolean) => {
      this._markRadiosForCheck();
      return disabledInteractive;
    },
  });
  readonly change = output<GnroRadioChange>();

  ngAfterContentInit(): void {
    this._isInitialized = true;
    this._buttonChanges = this._radios.changes.subscribe(() => {
      if (this.selected$() && !this._radios.find((radio) => radio === this.selected$())) {
        this.selected$.set(null);
      }
    });
  }

  ngOnDestroy(): void {
    this._buttonChanges?.unsubscribe();
  }

  _touch(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private _checkSelectedRadioButton(): void {
    if (this.selected$() && !this.selected$()?.checked) {
      this.selected$()!.checked = true;
    }
  }

  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.name = this.name();
        radio._markForCheck();
      });
    }
  }

  private _updateSelectedRadioFromValue(): void {
    const isAlreadySelected = this.selected$() !== null && this.selected$()!.value === this.value$();
    if (this._radios && !isAlreadySelected) {
      this.selected$.set(null);
      this._radios.forEach((radio) => {
        radio.checked = this.value$() === radio.value;
        if (radio.checked) {
          this.selected$.set(radio);
        }
      });
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
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled$.set(isDisabled);
    this.changeDetectorRef.markForCheck();
  }
}
