import {
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  input,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { GnroSpinnerComponent } from './spinner.component';
import { GnroSpinnerSize } from './spinner.model';

@Directive({
  selector: '[gnroSpinner]',
})
export class GnroSpinnerDirective {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);
  private spinner!: ComponentRef<GnroSpinnerComponent>;
  spinnerSize = input<GnroSpinnerSize>('medium', { alias: 'gnroSpinnerSize' });
  message = input('', {
    alias: 'gnroSpinnerMessage',
    transform: (message: string) => {
      if (this.spinner) {
        this.spinner.instance._message.set(message);
      }
      return message;
    },
  });
  nbSpinner = input(false, {
    alias: 'gnroSpinner',
    transform: (nbSpinner: boolean) => {
      if (nbSpinner) {
        this.show();
      } else {
        this.hide();
      }
      return nbSpinner;
    },
  });

  @HostBinding('class.gnro-spinner-container') isSpinnerPresent = false;

  show(): void {
    if (!this.isSpinnerPresent) {
      this.spinner = this.viewContainerRef.createComponent<GnroSpinnerComponent>(GnroSpinnerComponent);
      this.spinner.instance._size.set(this.spinnerSize());
      this.spinner.instance._message.set(this.message());
      this.renderer.appendChild(this.elementRef.nativeElement, this.spinner.location.nativeElement);
      this.isSpinnerPresent = true;
    }
  }

  hide(): void {
    if (this.isSpinnerPresent) {
      this.viewContainerRef.remove();
      this.isSpinnerPresent = false;
    }
  }
}
