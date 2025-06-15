import { Directive, ElementRef, HostListener, input, OnDestroy, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { debounce, filter, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[gnroNumeric]',
})
export class GnroNumericDirective implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly valueChange$: BehaviorSubject<string> = new BehaviorSubject('');
  decimals = input<number>(2);
  allowNegative = input<boolean>(false);

  constructor(
    @Optional() @Self() private ngControl: NgControl,
    private el: ElementRef<HTMLInputElement>,
  ) {
    this.valueChange$
      .pipe(
        debounce(() => interval(1)),
        filter(() => this.el.nativeElement.value !== ''),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
