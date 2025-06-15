import { Directive, input } from '@angular/core';
import { isNumeric } from '@gnro/ui/core';

@Directive({
  selector: 'fieldset[gnroFieldsetLabelWidth]',
})
export class GnroFieldsetLabelWidthDirective {
  width = input(undefined, {
    alias: 'gnroFieldsetLabelWidth',
    transform: (width: number | string | undefined) => {
      if (width) {
        return isNumeric(width) ? `${width}px` : (width as string);
      }
      return undefined;
    },
  });
}
