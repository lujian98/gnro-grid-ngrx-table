import { _IdGenerator, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  ANIMATION_MODULE_TYPE,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  afterNextRender,
  booleanAttribute,
  forwardRef,
  inject,
  numberAttribute,
  HostAttributeToken,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppRadioDefaultOptions, MAT_RADIO_DEFAULT_OPTIONS } from './radio.model';
import { AppRadioChange, AppRadioButton } from './radio';
/*
export class AppRadioChange {
  constructor(
    public source: AppRadioButton,
    public value: any,
  ) {}
}*/

export const MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AppRadioGroup),
  multi: true,
};

export const MAT_RADIO_GROUP = new InjectionToken<AppRadioGroup>('AppRadioGroup');

@Directive({
  selector: 'app-radio-group',
  exportAs: 'appRadioGroup',
  providers: [MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, { provide: MAT_RADIO_GROUP, useExisting: AppRadioGroup }],
  host: {
    role: 'radiogroup',
    class: 'mat-mdc-radio-group',
  },
})
export class AppRadioGroup implements AfterContentInit, OnDestroy, ControlValueAccessor {
  private _changeDetector = inject(ChangeDetectorRef);
  private _value: any = null;
  private _name: string = inject(_IdGenerator).getId('mat-radio-group-');
  private _selected: AppRadioButton | null = null;
  private _isInitialized: boolean = false;
  private _labelPosition: 'before' | 'after' = 'after';
  private _disabled: boolean = false;
  private _required: boolean = false;
  private _buttonChanges!: Subscription;
  _controlValueAccessorChangeFn: (value: any) => void = () => {};
  onTouched: () => any = () => {};
  @Output() readonly change: EventEmitter<AppRadioChange> = new EventEmitter<AppRadioChange>();
  @ContentChildren(forwardRef(() => AppRadioButton), { descendants: true })
  _radios!: QueryList<AppRadioButton>;

  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }
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
  set selected(selected: AppRadioButton | null) {
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

  //constructor(...args: unknown[]);

  //constructor() {}

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
        radio.name = this.name;
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
      this.change.emit(new AppRadioChange(this._selected!, this._value));
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
