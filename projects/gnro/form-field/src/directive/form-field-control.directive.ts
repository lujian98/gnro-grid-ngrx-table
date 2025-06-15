import { Directive, input } from '@angular/core';
import { FormControl } from '@angular/forms';

//TODO not used
@Directive({
  selector: 'gnro-form-field[gnroFormFieldControl] ',
})
export class GnroFormFieldControlDirective {
  fieldControl = input<FormControl>(undefined, { alias: 'gnroFormFieldControl' });
}
