import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroErrorDirective } from '../directive/error.directive';

@Component({
  selector: 'gnro-field-errors',
  templateUrl: './field-errors.component.html',
  styleUrls: ['./field-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, GnroIconModule, GnroErrorDirective],
})
export class GnroFieldsErrorsComponent {
  errors = input([], {
    transform: (errors: ValidationErrors | null | undefined) => {
      if (errors) {
        return Object.keys(errors).map((key) => ({ type: key, ...errors[key] }));
      } else {
        return [];
      }
    },
  });
}
