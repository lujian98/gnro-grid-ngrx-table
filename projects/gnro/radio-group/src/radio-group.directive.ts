import { _IdGenerator } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  booleanAttribute,
  forwardRef,
  inject,
  input,
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
  private _changeDetector = inject(ChangeDetectorRef);
  private _value: any = null;
  private _selected: GnroRadioComponent | null = null;
  private _isInitialized: boolean = false;
  private _labelPosition: 'before' | 'after' = 'after';
  private _disabled: boolean = false;
  private _required: boolean = false;
  private _buttonChanges!: Subscription;
  _controlValueAccessorChangeFn: (value: any) => void = () => {};
  onTouched: () => any = () => {};
  @Output() readonly change: EventEmitter<GnroRadioChange> = new EventEmitter<GnroRadioChange>();
  @ContentChildren(forwardRef(() => GnroRadioComponent), { descendants: true })
  _radios!: QueryList<GnroRadioComponent>;

  name = input(inject(_IdGenerator).getId('gnro-radio-group-'), {
    transform: (name: string) => {
      this._updateRadioButtonNames();
      return name;
    },
  });

  @Input()
  get labelPosition(): 'before' | 'after' {
    return this._labelPosition;
  }
  set labelPosition(v) {
    this._labelPosition = v === 'before' ? 'before' : 'after';
    this._markRadiosForCheck();
  }
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

  _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
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

  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this._markRadiosForCheck();
  }

  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = value;
    this._markRadiosForCheck();
  }

  @Input({ transform: booleanAttribute })
  get disabledInteractive(): boolean {
    return this._disabledInteractive;
  }
  set disabledInteractive(value: boolean) {
    this._disabledInteractive = value;
    this._markRadiosForCheck();
  }
  private _disabledInteractive = false;

  ngAfterContentInit() {
    this._isInitialized = true;
    this._buttonChanges = this._radios.changes.subscribe(() => {
      if (this.selected && !this._radios.find((radio) => radio === this.selected)) {
        this._selected = null;
      }
    });
  }

  ngOnDestroy() {
    this._buttonChanges?.unsubscribe();
  }

  _touch() {
    if (this.onTouched) {
      this.onTouched();
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
    const isAlreadySelected = this._selected !== null && this._selected.value === this._value;

    if (this._radios && !isAlreadySelected) {
      this._selected = null;
      this._radios.forEach((radio) => {
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

  _markRadiosForCheck() {
    if (this._radios) {
      this._radios.forEach((radio) => radio._markForCheck());
    }
  }

  writeValue(value: any) {
    this.value = value;
    this._changeDetector.markForCheck();
  }

  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
}
