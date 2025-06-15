import { Directive, InjectionToken, inject } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

export const GNRO_TAB_LABEL = new InjectionToken<GnroTabLabelDirective>('GnroTabLabel');
export const GNRO_TAB = new InjectionToken<any>('GNRO_TAB');

@Directive({
  selector: '[gnro-tab-label], [gnroTabLabel]',
  providers: [{ provide: GNRO_TAB_LABEL, useExisting: GnroTabLabelDirective }],
})
export class GnroTabLabelDirective extends CdkPortal {
  _closestTab = inject(GNRO_TAB, { optional: true });
}
