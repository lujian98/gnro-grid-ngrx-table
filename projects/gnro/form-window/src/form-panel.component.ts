import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GrnoDataType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroLayoutComponent } from '@gnro/ui/layout';
import { GnroFormComponent, GnroFormConfig } from '@gnro/ui/form';

@Component({
  selector: 'gnro-form-panel',
  templateUrl: './form-panel.component.html',
  styleUrls: ['./form-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroLayoutComponent, GnroFormComponent],
})
export class GnroFormPanelComponent {
  formConfig = input.required<Partial<GnroFormConfig>>();
  formFields = input<GnroFormField[]>([]);
  values = input<GrnoDataType>({});
}
