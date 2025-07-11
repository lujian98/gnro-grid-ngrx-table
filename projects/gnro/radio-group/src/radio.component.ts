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
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  afterNextRender,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { GNRO_RADIO_GROUP, GnroRadioGroupDirective } from './radio-group.directive';

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
    '[attr.id]': 'id',
    '[class.gnro-radio-checked]': 'checked$()',
    '[class.gnro-radio-disabled]': 'disabled$()',
    '[class.gnro-radio-disabled-interactive]': 'disabledInteractive$()',
    '[attr.tabindex]': 'null',
    '(focus)': 'inputElement.nativeElement.focus()',
  },
  exportAs: 'gnroRadio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: GnroRadioGroupDirective, useExisting: forwardRef(() => GnroRadioGroupDirective) }],
})
export class GnroRadioComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  protected elementRef = inject(ElementRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private injector = inject(Injector);
  private _focusMonitor = inject(FocusMonitor);
  private _radioDispatcher = inject(UniqueSelectionDispatcher);
  private _ngZone = inject(NgZone);
  private _renderer = inject(Renderer2);
  private _uniqueId = inject(_IdGenerator).getId('gnro-radio-');
  private _cleanupClick: (() => void) | undefined;
  private _removeUniqueSelectionListener: () => void = () => {};
  private radioGroup: GnroRadioGroupDirective;
  private previousTabIndex: number | undefined;

  id = input<string>(this._uniqueId);
  inputId = computed(() => `${this.id() || this._uniqueId}-input`);
  name$ = computed(() => this.radioGroup.name()); // name must be same within group
  tabIndex = input<number>(0);
  checked$ = signal<boolean>(false);
  checked = input(false, {
    transform: (checked: boolean) => {
      this.setChecked(checked);
      return checked;
    },
  });
  value$ = signal<any>(null);
  value = input(null, {
    transform: (value: any) => {
      if (this.value$() !== value) {
        this.value$.set(value);
        if (this.radioGroup !== null) {
          if (!this.checked$()) {
            this.setChecked(this.radioGroup.value$() === this.value$());
          }
          if (this.checked$()) {
            this.radioGroup.setSelected(this);
          }
        }
      }
      return value;
    },
  });
  labelPosition = input<'before' | 'after'>('after');
  labelPosition$ = computed(() => this.labelPosition() || this.radioGroup?.labelPosition());
  disabled = model(false);
  disabled$ = computed(() => this.disabled() || this.radioGroup?.disabled$());
  required = input(false);
  required$ = computed(() => this.required() || this.radioGroup?.required());
  disabledInteractive = input(false);
  disabledInteractive$ = computed(() => this.disabledInteractive() || this.radioGroup?.disabledInteractive());
  @Output() readonly change: EventEmitter<GnroRadioChange> = new EventEmitter<GnroRadioChange>();
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  constructor() {
    this.radioGroup = inject<GnroRadioGroupDirective>(GNRO_RADIO_GROUP, { optional: true })!;
  }

  focus(options?: FocusOptions, origin?: FocusOrigin): void {
    if (origin) {
      this._focusMonitor.focusVia(this.inputElement, origin, options);
    } else {
      this.inputElement.nativeElement.focus(options);
    }
  }

  _markForCheck() {
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit() {
    if (this.radioGroup) {
      this.setChecked(this.radioGroup.value$() === this.value$());
      if (this.checked$()) {
        this.radioGroup.setSelected(this);
      }
    }
    this._removeUniqueSelectionListener = this._radioDispatcher.listen((id, name) => {
      if (id !== this.id() && name === this.name$()) {
        this.setChecked(false);
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
      this._cleanupClick = this._renderer.listen(this.inputElement.nativeElement, 'click', this._onInputClick);
    });
  }

  private _emitChangeEvent(): void {
    this.change.emit(new GnroRadioChange(this, this.value$()));
  }

  _onInputInteraction(event: Event): void {
    event.stopPropagation();
    if (!this.checked$() && !this.disabled$()) {
      const groupValueChanged = this.radioGroup && this.value$() !== this.radioGroup.value$();
      this.setChecked(true);
      this._emitChangeEvent();
      if (this.radioGroup) {
        this.radioGroup._controlValueAccessorChangeFn(this.value$());
        if (groupValueChanged) {
          this.radioGroup._emitChangeEvent();
        }
      }
    }
  }

  setChecked(checked: boolean): void {
    if (this.checked$() !== checked) {
      this.checked$.set(checked);
      if (checked && this.radioGroup?.value$() !== this.value$()) {
        this.radioGroup.setSelected(this);
      } else if (!checked && this.radioGroup?.value$() === this.value$()) {
        this.radioGroup.setSelected(null);
      }
      if (checked) {
        this._radioDispatcher.notify(this.id(), this.name$());
      }
      this.changeDetectorRef.markForCheck();
    }
  }

  _onTouchTargetClick(event: Event): void {
    this._onInputInteraction(event);
    if (!this.disabled$() || this.disabledInteractive$()) {
      this.inputElement?.nativeElement.focus();
    }
  }

  protected _setDisabled(value: boolean): void {
    if (this.disabled$() !== value) {
      this.disabled.set(value);
      this.changeDetectorRef.markForCheck();
    }
  }

  private _onInputClick = (event: Event) => {
    if (this.disabled$() && this.disabledInteractive$()) {
      event.preventDefault();
    }
  };

  private _updateTabIndex(): void {
    const radioGroup = this.radioGroup;
    let value: number;
    if (!radioGroup || !radioGroup.selected$() || this.disabled$()) {
      value = this.tabIndex();
    } else {
      value = radioGroup.selected$() === this ? this.tabIndex() : -1;
    }
    if (value !== this.previousTabIndex) {
      const input: HTMLInputElement | undefined = this.inputElement?.nativeElement;
      if (input) {
        input.setAttribute('tabindex', value + '');
        this.previousTabIndex = value;
        afterNextRender(
          () => {
            queueMicrotask(() => {
              if (radioGroup?.selected$() !== this && document.activeElement === input) {
                radioGroup.selected$()?.inputElement.nativeElement.focus();
                if (document.activeElement === input) {
                  this.inputElement.nativeElement.blur();
                }
              }
            });
          },
          { injector: this.injector },
        );
      }
    }
  }

  ngOnDestroy(): void {
    this._cleanupClick?.();
    this._focusMonitor.stopMonitoring(this.elementRef);
    this._removeUniqueSelectionListener();
  }
}
