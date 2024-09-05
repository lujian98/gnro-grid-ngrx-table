import { Directive } from '@angular/core';

/** Suffix to be placed at the end of the form field. */
@Directive({
  selector: '[iccSuffix]',
  standalone: true,
})
export class IccSuffix {}
