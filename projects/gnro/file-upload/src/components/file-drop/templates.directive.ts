import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[gnro-file-drop-content-tmp]',
})
export class GnroFileDropContentTemplateDirective<T> {
  constructor(public template: TemplateRef<T>) {}
}
