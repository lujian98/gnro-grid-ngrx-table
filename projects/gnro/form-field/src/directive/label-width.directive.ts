import { Directive, input } from '@angular/core';
import { isNumeric } from '@gnro/ui/core';

@Directive({
  selector: 'gnro-form-field[gnroLabelWidth]',
})
export class GnroLabelWidthDirective {
  width = input(undefined, {
    alias: 'gnroLabelWidth',
    transform: (width: number | string | undefined) => {
      if (width) {
        return isNumeric(width) ? `${width}px` : (width as string);
      }
      return undefined;
    },
  });
}
