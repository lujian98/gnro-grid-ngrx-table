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

export const GNRO_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GnroRadioGroupDirective),
  multi: true,
};

export const GNRO_RADIO_GROUP = new InjectionToken<GnroRadioGroupDirective>('GnroRadioGroup');

@Directive({
  selector: 'gnro-radio-group',
  exportAs: 'gnroRadioGroup',
  providers: [
    GNRO_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
    { provide: GNRO_RADIO_GROUP, useExisting: GnroRadioGroupDirective },
  ],
  host: {
    role: 'radiogroup',
    class: 'gnro-mdc-radio-group',
  },
})
export class GnroRadioGroupDirective implements AfterContentInit, ControlValueAccessor {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private isInitialized: boolean = false;
  controlValueAccessorChangeFn: (value: unknown) => void = () => {};
  onTouched: () => unknown = () => {};

  name = input<string>(inject(_IdGenerator).getId('gnro-radio-group-'));
  labelPosition = input<'before' | 'after'>('after');
  value$ = signal<unknown>(null);
  value = input(null, {
    transform: (value: unknown) => {
      this.setValue(value);
      return value;
    },
  });
  selected$ = signal<GnroRadioComponent | null>(null);
  selected = input(null, {
    transform: (selected: GnroRadioComponent | null) => {
      this.setSelected(selected);
      return selected;
    },
  });
  disabled = model(false);
  disabled$ = computed(() => this.disabled());
  required = input(false);
  disabledInteractive = input(false);
  readonly change = output<GnroRadioChange>();
  @ContentChildren(forwardRef(() => GnroRadioComponent), { descendants: true })
  private radios!: QueryList<GnroRadioComponent>;

  ngAfterContentInit(): void {
    this.isInitialized = true;
    this.radios.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.selected$() && !this.radios.find((radio) => radio === this.selected$())) {
        this.setSelected(null, false);
      }
    });
  }

  touch(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  setSelected(selected: GnroRadioComponent | null, check = true): void {
    this.selected$.set(selected);
    if (check) {
      this.setValue(selected ? selected.value$() : null);
      this.checkSelectedRadioButton();
    }
  }

  emitChangeEvent(): void {
    if (this.isInitialized) {
      this.change.emit(new GnroRadioChange(this.selected$()!, this.value$()));
    }
  }

  writeValue(value: unknown): void {
    this.setValue(value);
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.controlValueAccessorChangeFn = fn;
  }

  registerOnTouched(fn: () => unknown): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
    this.changeDetectorRef.markForCheck();
  }

  private setValue(value: unknown): void {
    this.value$.set(value);
    this.updateSelectedRadioFromValue();
    this.checkSelectedRadioButton();
  }

  private updateSelectedRadioFromValue(): void {
    const isAlreadySelected = this.selected !== null && this.selected$()?.value === this.value$();
    if (this.radios && !isAlreadySelected) {
      this.setSelected(null, false);
      this.radios.forEach((radio) => {
        radio.setChecked(this.value$() === radio.value$());
        if (radio.checked$()) {
          this.setSelected(radio, false);
        }
      });
    }
  }

  private checkSelectedRadioButton(): void {
    if (this.selected$() && !this.selected$()!.checked) {
      this.selected$()!.setChecked(true);
    }
  }
}
