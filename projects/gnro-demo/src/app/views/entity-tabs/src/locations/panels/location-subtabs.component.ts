import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroTextFieldComponent, GnroTextFieldConfig, defaultTextFieldConfig } from '@gnro/ui/fields';

import { GnroTabGroupComponent, GnroTabComponent } from '@gnro/ui/tab-group';

@Component({
  selector: 'app-location-subtabs',
  template: `
    <div>Location Subtabs</div>
    <gnro-tab-group selectedIndex="1">
      <gnro-tab label="Tab 1"> </gnro-tab>
      <gnro-tab label="Tab 2"> </gnro-tab>
      <gnro-tab label="Tab 3"> </gnro-tab>
    </gnro-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroTabGroupComponent, GnroTabComponent, FormsModule, ReactiveFormsModule],
})
export class AppLocationSubtabsComponent implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Input() values: Record<string, unknown> = {};

  ngOnInit(): void {}
}
