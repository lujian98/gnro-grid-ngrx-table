import { AfterViewInit, Directive, ElementRef, inject, input, TemplateRef, Type } from '@angular/core';
import { DEFAULT_OVERLAY_SERVICE_CONFIG, GnroOverlayServiceConfig, GnroPosition, GnroTrigger } from '@gnro/ui/overlay';
import { GnroPopoverService } from './popover-service';
import { GnroPopoverComponent } from './popover.component';

@Directive({
  selector: '[gnroPopover]',
  exportAs: 'gnroPopover',
  providers: [GnroPopoverService],
})
export class GnroPopoverDirective<T> implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);
  private readonly popoverService = inject(GnroPopoverService);
  content = input.required<Type<T> | TemplateRef<T>>({ alias: 'gnroPopover' });
  context = input(undefined, {
    alias: 'gnroPopoverContext',
    transform: (context: {}) => {
      this.popoverService.rebuild(context, this.content());
      return context;
    },
  });
  position = input<GnroPosition>(GnroPosition.BOTTOM, { alias: 'gnroPopoverPosition' });
  trigger = input<GnroTrigger>(GnroTrigger.HOVER, { alias: 'gnroPopoverTrigger' });
  style = input<string>('', { alias: 'gnroPopoverStyle' });
  popoverLevel = input<number>(0);
  clickToClose = input<boolean>(false);

  ngAfterViewInit(): void {
    const overlayServiceConfig: GnroOverlayServiceConfig = {
      ...DEFAULT_OVERLAY_SERVICE_CONFIG,
      trigger: this.trigger(),
      position: this.position(),
      popoverLevel: this.popoverLevel(),
      clickToClose: this.clickToClose(),
    };
    this.popoverService.build(
      GnroPopoverComponent,
      this.elementRef,
      overlayServiceConfig,
      this.content(),
      this.context()!,
    );
  }
}
