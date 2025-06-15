import { Directive, ElementRef, Input, booleanAttribute, inject } from '@angular/core';
import { GnroInkBarItemDirective } from './ink-bar.directive';

@Directive({
  selector: '[gnroTabLabelWrapper]',
  host: {
    '[class.gnro-mdc-tab-disabled]': 'disabled',
    '[attr.aria-disabled]': '!!disabled',
  },
})
export class GnroTabLabelWrapperDirective extends GnroInkBarItemDirective {
  elementRef = inject(ElementRef);

  @Input({ transform: booleanAttribute })
  disabled: boolean = false;

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }
}
