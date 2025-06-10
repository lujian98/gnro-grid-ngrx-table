import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Optional,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, take, takeUntil, timer } from 'rxjs';
import { IccFieldWidthDirective } from './directive/field-width.directive';
import { IccFieldsetLabelWidthDirective } from './directive/fieldset-label-width.directive';
import { IccFormLabelWidthDirective } from './directive/form-label-width.directive';
import { IccInputDirective } from './directive/input.directive';
import { IccLabelWidthDirective } from './directive/label-width.directive';
import { IccLabelDirective } from './directive/label.directive';
import { DEFAULT_FORM_FIELD_LABEL_WIDTH } from './models/form-field.model';

@Component({
  selector: 'icc-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.icc-form-field-invalid]': 'invalid',
  },
})
export class IccFormFieldComponent implements AfterViewInit, OnDestroy {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  private _fieldIndicator: string = '';
  public readonly elementRef = inject(ElementRef); // autocomplete.directive need this public
  focused: boolean = false;
  fieldWidth: string = '100%';
  invalid: boolean = false;
  showFieldEditIndicator = input(false);
  field = input(undefined, {
    alias: 'iccFormFieldControl',
    transform: (field: FormControl) => {
      field.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.setFieldIndicator());
      return field;
    },
  });

  get formFieldControl(): FormControl | undefined {
    return this.field();
    //return this.formFieldControlDirective?.fieldControl;
  }
  get required(): boolean {
    const control = this.formFieldControl;
    return !!control && control.hasValidator(Validators.required) && !control.disabled;
  }

  private set fieldIndicator(val: string) {
    this._fieldIndicator = val;
  }
  get fieldIndicator(): string {
    return this.showFieldEditIndicator() ? this._fieldIndicator : '';
  }

  @ContentChild(IccInputDirective) public inputDirective!: IccInputDirective;
  @ContentChild(IccLabelDirective) private iccLabel!: IccLabelDirective;
  @ViewChild('label') private label!: ElementRef;

  constructor(
    @Optional() private formLabelWidthDirective: IccFormLabelWidthDirective,
    @Optional() private fieldsetLabelWidthDirective: IccFieldsetLabelWidthDirective,
    @Optional() private labelWidthDirective: IccLabelWidthDirective,
    @Optional() private fieldWidthDirective: IccFieldWidthDirective,
  ) {}

  ngAfterViewInit(): void {
    if (!this.iccLabel) {
      this.label.nativeElement.remove();
    } else if (this.label) {
      let width = '';
      if (this.formLabelWidthDirective && this.formLabelWidthDirective.width) {
        width = this.formLabelWidthDirective.width;
      }
      if (this.fieldsetLabelWidthDirective && this.fieldsetLabelWidthDirective.width) {
        width = this.fieldsetLabelWidthDirective.width;
      }
      if (this.labelWidthDirective && this.labelWidthDirective.width) {
        width = this.labelWidthDirective.width;
      }
      if (!width) {
        width = DEFAULT_FORM_FIELD_LABEL_WIDTH;
      }
      this.label.nativeElement.style.setProperty('flex', `0 0 ${width}`);
    }
    if (this.fieldWidthDirective && this.fieldWidthDirective.width) {
      this.fieldWidth = this.fieldWidthDirective.width;
    }
    this.setFieldIndicator();
  }

  private setFieldIndicator(): void {
    this.checkFieldIndicator();
    const control = this.formFieldControl;
    this.invalid = (!!control?.touched || !!control?.dirty) && !!control?.invalid;
    this.changeDetectorRef.markForCheck();
  }

  private checkFieldIndicator(): void {
    timer(100)
      .pipe(take(1))
      .subscribe(() => {
        let fieldIndicator = '';
        const control = this.formFieldControl;
        if (control && !control.disabled) {
          fieldIndicator = control.dirty ? `icc-form-field-indicator-red` : `icc-form-field-indicator-green`;
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
