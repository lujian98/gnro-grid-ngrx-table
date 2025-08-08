import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ContentChild,
  DestroyRef,
  ElementRef,
  inject,
  input,
  Optional,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { take, timer } from 'rxjs';
import { GnroFieldWidthDirective } from './directive/field-width.directive';
import { GnroFieldsetLabelWidthDirective } from './directive/fieldset-label-width.directive';
import { GnroFormLabelWidthDirective } from './directive/form-label-width.directive';
import { GnroInputDirective } from './directive/input.directive';
import { GnroLabelWidthDirective } from './directive/label-width.directive';
import { GnroLabelDirective } from './directive/label.directive';
import { GnroFieldsErrors2Component } from './field-errors/field-errors.component';
import { DEFAULT_FORM_FIELD_LABEL_WIDTH } from './models/form-field.model';

@Component({
  selector: 'gnro-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroFieldsErrors2Component],
  host: {
    '[class.gnro-form-field-invalid]': 'invalid',
  },
})
export class GnroFormFieldComponent implements AfterViewInit {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private _fieldIndicator: string = '';
  //height = '24px';
  lineheight$ = computed(() => (this.gnroLineHeight() ? `${this.gnroLineHeight()}px` : '28px'));
  gnroLineHeight = input<number | undefined>(25);
  public readonly elementRef = inject(ElementRef); // autocomplete.directive need this public
  focused: boolean = false;
  fieldWidth: string = '100%';
  invalid: boolean = false;
  showFieldEditIndicator = input<boolean>(false);
  field = input(undefined, {
    alias: 'gnroFormFieldControl',
    transform: (field: FormControl) => {
      field.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.setFieldIndicator());
      return field;
    },
  });
  editable = input(false, {
    transform: (editable: boolean) => {
      editable ? this.field()!.enable() : this.field()!.disable();
      return editable;
    },
  });

  get required(): boolean {
    return !!(this.field()?.hasValidator(Validators.required) && !this.field()?.disabled);
  }

  private set fieldIndicator(val: string) {
    this._fieldIndicator = val;
  }
  get fieldIndicator(): string {
    return this.showFieldEditIndicator() ? this._fieldIndicator : '';
  }

  @ContentChild(GnroInputDirective) public inputDirective!: GnroInputDirective;
  @ContentChild(GnroLabelDirective) private gnroLabel!: GnroLabelDirective;
  @ViewChild('label') private label!: ElementRef;

  constructor(
    @Optional() private formLabelWidthDirective: GnroFormLabelWidthDirective,
    @Optional() private fieldsetLabelWidthDirective: GnroFieldsetLabelWidthDirective,
    @Optional() private labelWidthDirective: GnroLabelWidthDirective,
    @Optional() private fieldWidthDirective: GnroFieldWidthDirective,
  ) {}

  ngAfterViewInit(): void {
    if (!this.gnroLabel) {
      this.label.nativeElement.remove();
    } else if (this.label) {
      let width = '';
      if (this.formLabelWidthDirective && this.formLabelWidthDirective.width()) {
        width = this.formLabelWidthDirective.width()!;
      }
      if (this.fieldsetLabelWidthDirective && this.fieldsetLabelWidthDirective.width()) {
        width = this.fieldsetLabelWidthDirective.width()!;
      }
      if (this.labelWidthDirective && this.labelWidthDirective.width()) {
        width = this.labelWidthDirective.width()!;
      }
      if (!width) {
        width = DEFAULT_FORM_FIELD_LABEL_WIDTH;
      }
      this.label.nativeElement.style.setProperty('flex', `0 0 ${width}`);
    }
    if (this.fieldWidthDirective && this.fieldWidthDirective.width()) {
      this.fieldWidth = this.fieldWidthDirective.width()!;
    }
    this.setFieldIndicator();
  }

  private setFieldIndicator(): void {
    this.checkFieldIndicator();
    this.invalid = (!!this.field()?.touched || !!this.field()?.dirty) && !!this.field()?.invalid;
    this.changeDetectorRef.markForCheck();
  }

  private checkFieldIndicator(): void {
    timer(100)
      .pipe(take(1))
      .subscribe(() => {
        let fieldIndicator = '';
        if (!this.field()?.disabled) {
          fieldIndicator = this.field()?.dirty ? `gnro-form-field-indicator-red` : `gnro-form-field-indicator-green`;
        }
        if (fieldIndicator !== this.fieldIndicator) {
          this.fieldIndicator = fieldIndicator;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  onMouseenter(): void {
    this.focused = true;
  }
  onMouseleave(): void {
    this.focused = false;
  }
}
