import { Directive, HostListener, inject } from '@angular/core';
import { GnroColumnResizeDirective } from './column-resize.directive';

@Directive({
  selector: '[gnroColumnResizeTrigger]',
})
export class GnroColumnResizeTriggerDirective {
  private readonly columnResizeDirective = inject(GnroColumnResizeDirective);

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    this.columnResizeDirective.onMouseDown(event);
  }
}
