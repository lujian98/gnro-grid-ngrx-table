import { Directive, input } from '@angular/core';
import { isNumeric } from '@gnro/ui/core';

@Directive({
  selector: 'form[gnroFormLabelWidth]',
})
export class GnroFormLabelWidthDirective {
  width = input(undefined, {
    alias: 'gnroFormLabelWidth',
    transform: (width: number | string | undefined) => {
      if (width) {
        return isNumeric(width) ? `${width}px` : (width as string);
      }
      return undefined;
    },
  });
}
