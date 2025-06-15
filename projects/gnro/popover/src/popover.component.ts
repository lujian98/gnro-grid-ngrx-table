import { ChangeDetectionStrategy, Component, Input, input, TemplateRef, Type, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { GnroOverlayModule } from '@gnro/ui/overlay';
import { GnroPortalComponent, GnroPortalContent } from '@gnro/ui/portal';
import { GnroPopoverService } from './popover-service';
import { GnroPopoverContainer } from './popover.model';

@Component({
  selector: 'gnro-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.style]': 'style',
  },
  imports: [GnroOverlayModule, GnroPortalComponent],
})
export class GnroPopoverComponent<T> implements GnroPopoverContainer {
  private readonly sanitizer = inject(DomSanitizer);
  @Input() content!: GnroPortalContent<T>;
  @Input() context!: Object;
  //content = input.required<GnroPortalContent<T>>();
  popoverService = input.required<GnroPopoverService<T>>();
  customStyle = input<string>('');

  get style(): SafeStyle {
    return this.customStyle ? this.sanitizer.bypassSecurityTrustStyle(this.customStyle()) : '';
  }

  @ViewChild(GnroPortalComponent, { static: true }) portal!: GnroPortalComponent<T>;

  close(): void {
    this.popoverService().hide();
  }

  renderContent(): void {
    this.detachContent();
    this.attachContent();
  }

  private detachContent(): void {
    this.portal.detach();
  }

  private attachContent(): void {
    if (this.content instanceof TemplateRef) {
      const context = {
        $implicit: this.context,
        close: this.close.bind(this),
      };
      this.portal.createTemplatePortal(this.content, context);
    } else if (this.content instanceof Type) {
      const context = Object.assign({}, this.context, {
        close: this.close.bind(this),
      });
      this.portal.createComponentPortal(this.content, context);
    }
  }
}
