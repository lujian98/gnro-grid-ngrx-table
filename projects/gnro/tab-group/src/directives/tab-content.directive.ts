import { Directive, InjectionToken, TemplateRef, inject } from '@angular/core';

export const GNRO_TAB_CONTENT = new InjectionToken<GnroTabContentDirective>('GnroTabContent');

@Directive({
  selector: '[gnroTabContent]',
  providers: [{ provide: GNRO_TAB_CONTENT, useExisting: GnroTabContentDirective }],
})
export class GnroTabContentDirective {
  template = inject<TemplateRef<any>>(TemplateRef);

  constructor(...args: unknown[]);
  constructor() {}
}
