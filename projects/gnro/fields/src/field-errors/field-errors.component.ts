import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { GnroErrorDirective } from '@gnro/ui/form-field';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gnro-field-errors',
  templateUrl: './field-errors.component.html',
  styleUrls: ['./field-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, GnroIconModule, GnroErrorDirective],
})
export class GnroFieldsErrorsComponent {
  errors = input.required({
    transform: (errors: ValidationErrors) => {
      return Object.keys(errors).map((key) => ({ type: key, ...errors[key] }));
    },
  });
}
