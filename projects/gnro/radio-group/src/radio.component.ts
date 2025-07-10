import { FocusMonitor, FocusOrigin, _IdGenerator } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  ANIMATION_MODULE_TYPE,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostAttributeToken,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  computed,
  signal,
  model,
  numberAttribute,
} from '@angular/core';
import { GnroRadioGroupDirective } from './radio-group.directive';
import { GNRO_RADIO_GROUP } from './radio-group.model';
import { GNRO_RADIO_DEFAULT_OPTIONS, GnroRadioDefaultOptions } from './radio.model';

export class GnroRadioChange {
  constructor(
    public source: GnroRadioComponent,
    public value: any,
  ) {}
}

@Component({
  selector: 'gnro-radio',
  templateUrl: './radio.component.html',
  // styleUrl: 'radio.css',
  host: {
    class: 'mat-mdc-radio-button',
    '[attr.id]': 'id',
    '[class.mat-mdc-radio-checked]': 'checked$()',
    '[class.mat-mdc-radio-disabled]': 'disabled',
    '[class.mat-mdc-radio-disabled-interactive]': 'disabledInteractive',
    '[class._mat-animation-noopable]': '_noopAnimations',
    '[attr.tabindex]': 'null',
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  exportAs: 'gnroRadio',
  //encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroRadioComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  protected readonly elementRef = inject(ElementRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _ngZone = inject(NgZone);
  private _renderer = inject(Renderer2);
  private _injector = inject(Injector);
  private _uniqueId = inject(_IdGenerator).getId('mat-radio-');
  private _focusMonitor = inject(FocusMonitor);
  private _radioDispatcher = inject(UniqueSelectionDispatcher);
  private _defaultOptions = inject<GnroRadioDefaultOptions>(GNRO_RADIO_DEFAULT_OPTIONS, {
    optional: true,
  });

  id = input<string>(this._uniqueId);
  inputId = computed(() => `${this.id() || this._uniqueId}-input`);
  name = model<string>('');
  tabIndex$ = signal<number>(0);
  tabIndex = input(0, {
    transform: (value: number) => {
      const tabIndex = value == null ? 0 : numberAttribute(value);
      this.tabIndex$.set(tabIndex);
      return tabIndex;
    },
  });
  checked$ = signal<boolean>(false);
  checked = input(false, {
    transform: (checked: boolean) => {
      if (this.checked$() !== checked) {
        this.checked$.set(checked);
        if (checked && this.radioGroup && this.radioGroup.value$() !== this.value) {
          this.radioGroup.selected$.set(this);
        } else if (!checked && this.radioGroup && this.radioGroup.value$() === this.value) {
          this.radioGroup.selected$.set(null);
        }
        if (checked) {
          this._radioDispatcher.notify(this.id(), this.name());
        }
        this.changeDetectorRef.markForCheck();
      }
      return checked;
    },
  });

  /*
  @Input({ transform: booleanAttribute })
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    if (this._checked !== value) {
      this._checked = value;
      if (value && this.radioGroup && this.radioGroup.value$() !== this.value) {
        this.radioGroup.selected$.set(this);
      } else if (!value && this.radioGroup && this.radioGroup.value$() === this.value) {
        this.radioGroup.selected$.set(null);
      }

      if (value) {
        this._radioDispatcher.notify(this.id(), this.name());
      }
      this.changeDetectorRef.markForCheck();
    }
  }
    */

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {
        if (!this.checked$()) {
          this.checked$.set(this.radioGroup.value$() === value);
        }
        if (this.checked$()) {
          this.radioGroup.selected$.set(this);
        }
      }
    }
  }

  @Input()
  get labelPosition(): 'before' | 'after' {
    return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition()) || 'after';
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  private _labelPosition!: 'before' | 'after';

  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled$());
  }
  set disabled(value: boolean) {
    this._setDisabled(value);
  }

  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required || (this.radioGroup && this.radioGroup.required());
  }
  set required(value: boolean) {
    this._required = value;
  }

  @Input({ transform: booleanAttribute })
  get disabledInteractive(): boolean {
    return this._disabledInteractive || (this.radioGroup !== null && this.radioGroup.disabledInteractive());
  }
  set disabledInteractive(value: boolean) {
    this._disabledInteractive = value;
  }
  private _disabledInteractive: boolean;

  @Output() readonly change: EventEmitter<GnroRadioChange> = new EventEmitter<GnroRadioChange>();

  radioGroup: GnroRadioGroupDirective;

  //private _checked: boolean = false;
  private _disabled!: boolean;
  private _required!: boolean;
  private _value: any = null;
  private _removeUniqueSelectionListener: () => void = () => {};
  private _previousTabIndex: number | undefined;
  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

  _noopAnimations: boolean;

  constructor() {
    const radioGroup = inject<GnroRadioGroupDirective>(GNRO_RADIO_GROUP, { optional: true })!;
    const animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });
    const tabIndex = inject(new HostAttributeToken('tabindex'), { optional: true });
    this.radioGroup = radioGroup;
    this._noopAnimations = animationMode === 'NoopAnimations';
    this._disabledInteractive = this._defaultOptions?.disabledInteractive ?? false;

    if (tabIndex) {
      this.tabIndex$.set(numberAttribute(tabIndex, 0));
    }
  }

  focus(options?: FocusOptions, origin?: FocusOrigin): void {
    if (origin) {
      this._focusMonitor.focusVia(this._inputElement, origin, options);
    } else {
      this._inputElement.nativeElement.focus(options);
    }
  }

  _markForCheck(): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit(): void {
    if (this.radioGroup) {
      this.checked$.set(this.radioGroup.value$() === this._value);

      if (this.checked$()) {
        this.radioGroup.selected$.set(this);
      }
      this.name.set(this.radioGroup.name());
    }

    this._removeUniqueSelectionListener = this._radioDispatcher.listen((id, name) => {
      if (id !== this.id() && name === this.name()) {
        this.checked$.set(false);
      }
    });
  }

  ngDoCheck(): void {
    this._updateTabIndex();
  }

  ngAfterViewInit(): void {
    this._updateTabIndex();
    this._focusMonitor.monitor(this.elementRef, true).subscribe((focusOrigin) => {
      if (!focusOrigin && this.radioGroup) {
        this.radioGroup._touch();
      }
    });

    this._ngZone.runOutsideAngular(() => {
      this._cleanupClick = this._renderer.listen(this._inputElement.nativeElement, 'click', this._onInputClick);
    });
  }

  ngOnDestroy(): void {
    this._cleanupClick?.();
    this._focusMonitor.stopMonitoring(this.elementRef);
    this._removeUniqueSelectionListener();
  }

  private _emitChangeEvent(): void {
    this.change.emit(new GnroRadioChange(this, this._value));
  }

  _onInputInteraction(event: Event): void {
    event.stopPropagation();

    if (!this.checked$() && !this.disabled) {
      const groupValueChanged = this.radioGroup && this.value !== this.radioGroup.value$();
      this.checked$.set(true);
      this._emitChangeEvent();

      if (this.radioGroup) {
        this.radioGroup._controlValueAccessorChangeFn(this.value);
        if (groupValueChanged) {
          this.radioGroup._emitChangeEvent();
        }
      }
    }
  }

  _onTouchTargetClick(event: Event): void {
    this._onInputInteraction(event);
    if (!this.disabled || this.disabledInteractive) {
      this._inputElement?.nativeElement.focus();
    }
  }

  private _cleanupClick: (() => void) | undefined;

  protected _setDisabled(value: boolean): void {
    if (this._disabled !== value) {
      this._disabled = value;
      this.changeDetectorRef.markForCheck();
    }
  }

  private _onInputClick = (event: Event) => {
    if (this.disabled && this.disabledInteractive) {
      event.preventDefault();
    }
  };

  private _updateTabIndex(): void {
    const group = this.radioGroup;
    let value: number;
    if (!group || !group.selected$() || this.disabled) {
      value = this.tabIndex$();
    } else {
      value = group.selected$() === this ? this.tabIndex$() : -1;
    }

    if (value !== this._previousTabIndex) {
      const input: HTMLInputElement | undefined = this._inputElement?.nativeElement;

      if (input) {
        input.setAttribute('tabindex', value + '');
        this._previousTabIndex = value;
        afterNextRender(
          () => {
            queueMicrotask(() => {
              if (group && group.selected$() && group.selected$() !== this && document.activeElement === input) {
                group.selected$()?._inputElement.nativeElement.focus();
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
