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

export class AppRadioChange {
  constructor(
    public source: AppRadioButton,
    public value: any,
  ) {}
}

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

@Component({
  selector: 'app-radio-button',
  templateUrl: 'radio.html',
  // styleUrl: 'radio.css',
  host: {
    class: 'mat-mdc-radio-button',
    '[attr.id]': 'id',
    '[class.mat-mdc-radio-checked]': 'checked',
    '[class.mat-mdc-radio-disabled]': 'disabled',
    '[class.mat-mdc-radio-disabled-interactive]': 'disabledInteractive',
    '[class._mat-animation-noopable]': '_noopAnimations',
    '[attr.tabindex]': 'null',
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  exportAs: 'appRadioButton',
  //encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRadioButton implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  protected _elementRef = inject(ElementRef);
  private _changeDetector = inject(ChangeDetectorRef);
  private _focusMonitor = inject(FocusMonitor);
  private _radioDispatcher = inject(UniqueSelectionDispatcher);
  private _defaultOptions = inject<AppRadioDefaultOptions>(MAT_RADIO_DEFAULT_OPTIONS, {
    optional: true,
  });

  private _ngZone = inject(NgZone);
  private _renderer = inject(Renderer2);
  private _uniqueId = inject(_IdGenerator).getId('mat-radio-');
  private _cleanupClick: (() => void) | undefined;

  @Input() id: string = this._uniqueId;
  @Input() name!: string;

  @Input({
    transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)),
  })
  tabIndex: number = 0;

  @Input({ transform: booleanAttribute })
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    if (this._checked !== value) {
      this._checked = value;
      if (value && this.radioGroup && this.radioGroup.value !== this.value) {
        this.radioGroup.selected = this;
      } else if (!value && this.radioGroup && this.radioGroup.value === this.value) {
        this.radioGroup.selected = null;
      }

      if (value) {
        this._radioDispatcher.notify(this.id, this.name);
      }
      this._changeDetector.markForCheck();
    }
  }

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {
        if (!this.checked) {
          this.checked = this.radioGroup.value === value;
        }
        if (this.checked) {
          this.radioGroup.selected = this;
        }
      }
    }
  }

  @Input()
  get labelPosition(): 'before' | 'after' {
    return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition) || 'after';
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  private _labelPosition!: 'before' | 'after';

  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled);
  }
  set disabled(value: boolean) {
    this._setDisabled(value);
  }

  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required || (this.radioGroup && this.radioGroup.required);
  }
  set required(value: boolean) {
    this._required = value;
  }

  @Input({ transform: booleanAttribute })
  get disabledInteractive(): boolean {
    return this._disabledInteractive || (this.radioGroup !== null && this.radioGroup.disabledInteractive);
  }
  set disabledInteractive(value: boolean) {
    this._disabledInteractive = value;
  }
  private _disabledInteractive: boolean;

  @Output() readonly change: EventEmitter<AppRadioChange> = new EventEmitter<AppRadioChange>();

  radioGroup: AppRadioGroup;

  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  private _checked: boolean = false;
  private _disabled!: boolean;
  private _required!: boolean;
  private _value: any = null;
  private _removeUniqueSelectionListener: () => void = () => {};
  private _previousTabIndex: number | undefined;
  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

  _noopAnimations: boolean;

  private _injector = inject(Injector);

  //constructor(...args: unknown[]);

  constructor() {
    const radioGroup = inject<AppRadioGroup>(MAT_RADIO_GROUP, { optional: true })!;
    const animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });
    const tabIndex = inject(new HostAttributeToken('tabindex'), { optional: true });
    this.radioGroup = radioGroup;
    this._noopAnimations = animationMode === 'NoopAnimations';
    this._disabledInteractive = this._defaultOptions?.disabledInteractive ?? false;

    if (tabIndex) {
      this.tabIndex = numberAttribute(tabIndex, 0);
    }
  }

  focus(options?: FocusOptions, origin?: FocusOrigin): void {
    if (origin) {
      this._focusMonitor.focusVia(this._inputElement, origin, options);
    } else {
      this._inputElement.nativeElement.focus(options);
    }
  }

  _markForCheck() {
    this._changeDetector.markForCheck();
  }

  ngOnInit() {
    if (this.radioGroup) {
      this.checked = this.radioGroup.value === this._value;

      if (this.checked) {
        this.radioGroup.selected = this;
      }
      this.name = this.radioGroup.name;
    }

    this._removeUniqueSelectionListener = this._radioDispatcher.listen((id, name) => {
      if (id !== this.id && name === this.name) {
        this.checked = false;
      }
    });
  }

  ngDoCheck(): void {
    this._updateTabIndex();
  }

  ngAfterViewInit() {
    this._updateTabIndex();
    this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
      if (!focusOrigin && this.radioGroup) {
        this.radioGroup._touch();
      }
    });

    this._ngZone.runOutsideAngular(() => {
      this._cleanupClick = this._renderer.listen(this._inputElement.nativeElement, 'click', this._onInputClick);
    });
  }

  ngOnDestroy() {
    this._cleanupClick?.();
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._removeUniqueSelectionListener();
  }

  private _emitChangeEvent(): void {
    this.change.emit(new AppRadioChange(this, this._value));
  }

  _onInputInteraction(event: Event) {
    event.stopPropagation();

    if (!this.checked && !this.disabled) {
      const groupValueChanged = this.radioGroup && this.value !== this.radioGroup.value;
      this.checked = true;
      this._emitChangeEvent();

      if (this.radioGroup) {
        this.radioGroup._controlValueAccessorChangeFn(this.value);
        if (groupValueChanged) {
          this.radioGroup._emitChangeEvent();
        }
      }
    }
  }

  _onTouchTargetClick(event: Event) {
    this._onInputInteraction(event);
    if (!this.disabled || this.disabledInteractive) {
      this._inputElement?.nativeElement.focus();
    }
  }

  protected _setDisabled(value: boolean) {
    if (this._disabled !== value) {
      this._disabled = value;
      this._changeDetector.markForCheck();
    }
  }

  private _onInputClick = (event: Event) => {
    if (this.disabled && this.disabledInteractive) {
      event.preventDefault();
    }
  };

  private _updateTabIndex() {
    const group = this.radioGroup;
    let value: number;
    if (!group || !group.selected || this.disabled) {
      value = this.tabIndex;
    } else {
      value = group.selected === this ? this.tabIndex : -1;
    }

    if (value !== this._previousTabIndex) {
      const input: HTMLInputElement | undefined = this._inputElement?.nativeElement;

      if (input) {
        input.setAttribute('tabindex', value + '');
        this._previousTabIndex = value;
        afterNextRender(
          () => {
            queueMicrotask(() => {
              if (group && group.selected && group.selected !== this && document.activeElement === input) {
                group.selected?._inputElement.nativeElement.focus();
                if (document.activeElement === input) {
                  this._inputElement.nativeElement.blur();
                }
              }
            });
          },
          { injector: this._injector },
        );
      }
    }
  }
}
