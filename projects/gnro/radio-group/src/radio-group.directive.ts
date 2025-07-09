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
  private _selected: GnroRadioComponent | null = null;
  private _isInitialized: boolean = false;
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

  private _checkSelectedRadioButton(): void {
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
    //this.value = selected ? selected.value : null;
    this.value$.set(selected ? selected.value : null);
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

  ngAfterContentInit(): void {
    this._isInitialized = true;
    this._buttonChanges = this._radios.changes.subscribe(() => {
      if (this.selected && !this._radios.find((radio) => radio === this.selected)) {
        this._selected = null;
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

  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.name = this.name();
        radio._markForCheck();
      });
    }
  }

  private _updateSelectedRadioFromValue(): void {
    const isAlreadySelected = this._selected !== null && this._selected.value === this.value$();

    if (this._radios && !isAlreadySelected) {
      this._selected = null;
      this._radios.forEach((radio) => {
        radio.checked = this.value$() === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }

  _emitChangeEvent(): void {
    if (this._isInitialized) {
      this.change.emit(new GnroRadioChange(this._selected!, this.value$()));
    }
  }

  _markRadiosForCheck(): void {
    if (this._radios) {
      this._radios.forEach((radio) => radio._markForCheck());
    }
  }

  writeValue(value: any): void {
    //this.value = value;
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
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }
}
