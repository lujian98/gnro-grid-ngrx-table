import { DestroyRef, Directive, ElementRef, HostListener, inject, input, Optional, Self } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, interval } from 'rxjs';
import { debounce, filter } from 'rxjs/operators';

@Directive({
  selector: '[gnroNumeric]',
})
export class GnroNumericDirective {
  private readonly destroyRef = inject(DestroyRef);
  private readonly valueChange$: BehaviorSubject<string> = new BehaviorSubject('');
  decimals = input<number>(2);
  allowNegative = input<boolean>(false);
  editable = input(false, {
    transform: (editable: boolean) => {
      this.valueChange$.next(this.el.nativeElement.value);
      return editable;
    },
  });

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    private el: ElementRef<HTMLInputElement>,
  ) {
    this.valueChange$
      .pipe(
        debounce(() => interval(1)),
        filter(() => this.el.nativeElement.value !== ''),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        //console.log( ' this.el.nativeElement.value=', this.el.nativeElement.value)
        if (!this.check(this.el.nativeElement.value)) {
          this.setValue(Number(this.el.nativeElement.value).toFixed(this.decimals()));
        }
        if (!this.allowNegative && Number(this.el.nativeElement.value) < 0) {
          this.setValue(String(-Number(this.el.nativeElement.value)));
        }
      });
  }

  private check(value: string): RegExpMatchArray | null {
    if (this.decimals() <= 0) {
      return String(value).match(new RegExp(/^-?\d+$/));
    } else {
      /****** the regex try to find if the number of chars after char dot '.' match input decimals value  *****/
      const regExpString =
        '^-?\\s*((\\d+(\\.\\d{0,' + this.decimals + '})?)|((\\d*(\\.\\d{1,' + this.decimals + '}))))\\s*$';
      return String(value).match(new RegExp(regExpString));
    }
  }

  private setValue(value: string): void {
    this.el.nativeElement.value = value;
    console.log('22222 value =', value);
    console.log('22222 this.ngControl?.control? =', this.ngControl?.control);
    this.ngControl?.control?.patchValue(value, { emitEvent: false, onlySelf: true });
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.valueChange$.next(this.el.nativeElement.value);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    this.valueChange$.next(this.el.nativeElement.value);
  }
}
