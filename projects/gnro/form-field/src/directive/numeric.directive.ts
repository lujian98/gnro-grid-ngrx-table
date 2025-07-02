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
  dirty = input(false, {
    transform: (dirty: boolean) => {
      this.valueChange$.next(this.el.nativeElement.value);
      return dirty;
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
        if (!this.check(this.el.nativeElement.value)) {
          this.setValue(Number(this.el.nativeElement.value).toFixed(this.decimals()));
        }
        if (!this.allowNegative && Number(this.el.nativeElement.value) < 0) {
          this.setValue(String(-Number(this.el.nativeElement.value)));
        }
      });
  }

  private check(value: string): boolean {
    if (this.decimals() <= 0) {
      return !!String(value).match(new RegExp(/^-?\d+$/));
    } else {
      const text = value.split('.');
      return text.length === 1 || text[1].length <= this.decimals();
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
}
