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
import { IccSpinnerComponent } from './spinner.component';
import { IccSpinnerSize } from './spinner.model';

@Directive({
  selector: '[iccSpinner]',
})
export class IccSpinnerDirective {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);
  private spinner!: ComponentRef<IccSpinnerComponent>;
  spinnerSize = input<IccSpinnerSize>('medium', { alias: 'iccSpinnerSize' });
  message = input('', {
    alias: 'iccSpinnerMessage',
    transform: (message: string) => {
      if (this.spinner) {
        this.spinner.instance._message.set(message);
      }
      return message;
    },
  });
  nbSpinner = input(false, {
    alias: 'iccSpinner',
    transform: (nbSpinner: boolean) => {
      if (nbSpinner) {
        this.show();
      } else {
        this.hide();
      }
      return nbSpinner;
    },
  });

  @HostBinding('class.icc-spinner-container') isSpinnerPresent = false;

  show(): void {
    if (!this.isSpinnerPresent) {
      this.spinner = this.viewContainerRef.createComponent<IccSpinnerComponent>(IccSpinnerComponent);
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
