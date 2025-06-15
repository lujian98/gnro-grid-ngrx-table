import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[gnroAutocompleteContent]',
})
export class GnroAutocompleteContentDirective<T> {
  constructor(public tpl: TemplateRef<T>) {}
}
