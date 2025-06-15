import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroSelectFieldConfig, GnroSelectFieldComponent, defaultSelectFieldConfig } from '@gnro/ui/fields';
import { State, STATES } from '../../../../data/states';

@Component({
  selector: 'app-string-array',
  templateUrl: './string-array.component.html',
  styleUrls: ['./string-array.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroSelectFieldComponent],
})
export class AppStringArrayComponent {
  listStates = [...STATES].map((state) => state.state);

  singleListState = 'Louisiana';

  singleSelectionList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    fieldLabel: 'Single Selection (list)',
    placeholder: 'Select One...',
  };

  multiSelectionList: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    fieldLabel: 'Multi Selection (list)',
    placeholder: 'Select One or More...',
  };
  multiListStates = ['Louisiana', 'Nevada'];

  displayFn(value: string | object | object[]): string {
    if (Array.isArray(value)) {
      return `Selected Total (${value.length})`;
    }
    return 'Test Display Fn';
  }

  multiSelectionDisplay: GnroSelectFieldConfig = {
    ...defaultSelectFieldConfig,
    multiSelection: true,
    displayWith: this.displayFn.bind(this),
    fieldLabel: 'Multi Selection (list)',
    placeholder: 'Select One or More...',
  };
  multiListStatesDisplay = ['Louisiana', 'Nevada'];
}
