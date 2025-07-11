import { _IdGenerator, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
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
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  afterNextRender,
  booleanAttribute,
  forwardRef,
  inject,
  numberAttribute,
  HostAttributeToken,
  Renderer2,
} from '@angular/core';
import { GnroRadioDefaultOptions, GNRO_RADIO_DEFAULT_OPTIONS } from './radio.model';
import { GnroRadioGroupDirective, GNRO_RADIO_GROUP } from './radio-group.directive';

export class GnroRadioChange {
  constructor(
    public source: GnroRadioComponent,
    public value: any,
  ) {}
}

@Component({
  selector: 'gnro-radio',
  templateUrl: 'radio.component.html',
  styleUrls: ['./radio.component.scss'],
  host: {
    class: 'gnro-mdc-radio-button',
    '[attr.id]': 'id',
    '[class.mat-mdc-radio-checked]': 'checked',
    '[class.mat-mdc-radio-disabled]': 'disabled',
    '[class.mat-mdc-radio-disabled-interactive]': 'disabledInteractive',
    '[class._mat-animation-noopable]': '_noopAnimations',
    '[attr.tabindex]': 'null',
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  exportAs: 'gnroRadioButton',
  //encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: GnroRadioGroupDirective, useExisting: forwardRef(() => GnroRadioGroupDirective) }],
})
export class GnroRadioComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  protected _elementRef = inject(ElementRef);
  private _changeDetector = inject(ChangeDetectorRef);
  private _focusMonitor = inject(FocusMonitor);
  private _radioDispatcher = inject(UniqueSelectionDispatcher);
  private _defaultOptions = inject<GnroRadioDefaultOptions>(GNRO_RADIO_DEFAULT_OPTIONS, {
    optional: true,
  });

  private _ngZone = inject(NgZone);
  private _renderer = inject(Renderer2);
  private _uniqueId = inject(_IdGenerator).getId('gnro-radio-');
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
    return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition()) || 'after';
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  private _labelPosition!: 'before' | 'after';

  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled());
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
    const radioGroup = inject<GnroRadioGroupDirective>(GNRO_RADIO_GROUP, { optional: true })!;
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
      this.name = this.radioGroup.name();
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
    this.change.emit(new GnroRadioChange(this, this._value));
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
