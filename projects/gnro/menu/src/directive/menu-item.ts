import { CdkMenuItem, CdkMenuItemSelectable } from '@angular/cdk/menu';
import { Directive, input } from '@angular/core';

@Directive({
  selector: '[gnroMenuItem]',
  exportAs: 'gnroMenuItem',
  host: {
    role: 'menuitem',
    '[class.cdk-menu-itemx]': 'true',
  },
  providers: [
    { provide: CdkMenuItemSelectable, useExisting: GnroMenuItem },
    { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
  ],
})
export class GnroMenuItem extends CdkMenuItemSelectable {
  keepOpen = input<boolean>(false);

  override trigger(options: { keepOpen: boolean } = { keepOpen: false }) {
    super.trigger({
      ...options,
      keepOpen: this.keepOpen(),
    });

    if (!this.disabled) {
      this.checked = !this.checked;
    }
  }
}
