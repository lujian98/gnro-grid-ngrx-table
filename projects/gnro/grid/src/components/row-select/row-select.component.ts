import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GnroCheckboxComponent } from '@gnro/ui/checkbox';

@Component({
  selector: 'gnro-row-select',
  templateUrl: 'row-select.component.html',
  styleUrls: ['./row-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroCheckboxComponent],
})
export class GnroRowSelectComponent {
  selected = input<boolean>(false);
  indeterminate = input<boolean>(false);
}
