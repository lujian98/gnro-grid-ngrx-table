import { Directive, input } from '@angular/core';
import { isNumeric } from '@gnro/ui/core';

@Directive({
  selector: 'gnro-form-field[gnroFieldWidth], fieldset[gnroFieldWidth]',
})
export class GnroFieldWidthDirective {
  width = input(undefined, {
    alias: 'gnroFieldWidth',
    transform: (width: number | string | undefined) => {
      if (width) {
        return isNumeric(width) ? `${width}px` : (width as string);
      }
      return undefined;
    },
  });
}
