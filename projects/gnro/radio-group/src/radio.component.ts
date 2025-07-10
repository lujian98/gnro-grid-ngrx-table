import { FocusMonitor, FocusOrigin, _IdGenerator } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostAttributeToken,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  afterNextRender,
  computed,
  inject,
  input,
  model,
  numberAttribute,
  signal,
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
  styleUrls: ['./radio.component.scss'],
  host: {
    '[attr.id]': 'id',
    '[class.gnro-radio-checked]': 'checked$()',
    '[class.gnro-radio-disabled]': 'disabled$()',
    '[class.gnro-radio-disabled-interactive]': 'disabledInteractive$()',
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
  private _defaultOptions = inject<GnroRadioDefaultOptions>(GNRO_RADIO_DEFAULT_OPTIONS, { optional: true });
  private _removeUniqueSelectionListener: () => void = () => {};
  private _previousTabIndex: number | undefined;
  private radioGroup: GnroRadioGroupDirective;

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
        if (checked && this.radioGroup && this.radioGroup.value$() !== this.value()) {
          this.radioGroup.selected$.set(this);
        } else if (!checked && this.radioGroup && this.radioGroup.value$() === this.value()) {
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
  value = input(undefined, {
    transform: (value: any) => {
      if (this.radioGroup !== null) {
        if (!this.checked$()) {
          this.checked$.set(this.radioGroup.value$() === value);
        }
        if (this.checked$()) {
          this.radioGroup.selected$.set(this);
        }
      }
      return value;
    },
  });
  labelPosition = input('after', {
    transform: (labelPosition: 'before' | 'after') => {
      return labelPosition || this.radioGroup?.labelPosition() || 'after';
    },
  });
  disabled$ = signal<boolean>(false);
  disabled = input(false, {
    transform: (value: boolean) => {
      const disabled = value || this.radioGroup?.disabled$();
      this.disabled$.set(disabled);
      return disabled;
    },
  });
  required = input(false, {
    transform: (required: boolean) => {
      return required || this.radioGroup?.required();
    },
  });
  disabledInteractive$ = signal<boolean>(false);
  disabledInteractive = input(false, {
    transform: (value: boolean) => {
      const disabledInteractive = value || this.radioGroup?.disabledInteractive();
      this.disabledInteractive$.set(disabledInteractive);
      return disabledInteractive;
    },
  });
  @Output() readonly change: EventEmitter<GnroRadioChange> = new EventEmitter<GnroRadioChange>();
  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

  constructor() {
    this.radioGroup = inject<GnroRadioGroupDirective>(GNRO_RADIO_GROUP, { optional: true })!;
    this.disabledInteractive$.set(this._defaultOptions?.disabledInteractive ?? false);
    const tabIndex = inject(new HostAttributeToken('tabindex'), { optional: true });
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
      this.checked$.set(this.radioGroup.value$() === this.value());
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
    this.change.emit(new GnroRadioChange(this, this.value()));
  }

  _onInputInteraction(event: Event): void {
    event.stopPropagation();
    if (!this.checked$() && !this.disabled$()) {
      const groupValueChanged = this.radioGroup && this.value() !== this.radioGroup.value$();
      this.checked$.set(true);
      this._emitChangeEvent();
      if (this.radioGroup) {
        this.radioGroup._controlValueAccessorChangeFn(this.value());
        if (groupValueChanged) {
          this.radioGroup._emitChangeEvent();
        }
      }
    }
  }

  private _cleanupClick: (() => void) | undefined;

  protected _setDisabled(value: boolean): void {
    if (this.disabled$() !== value) {
      this.disabled$.set(value);
      this.changeDetectorRef.markForCheck();
    }
  }

  private _onInputClick = (event: Event) => {
    if (this.disabled$() && this.disabledInteractive$()) {
      event.preventDefault();
    }
  };

  private _updateTabIndex(): void {
    const group = this.radioGroup;
    let value: number;
    if (!group || !group.selected$() || this.disabled$()) {
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
