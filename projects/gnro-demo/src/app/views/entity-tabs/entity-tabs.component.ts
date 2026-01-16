import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GnroAccordion, GnroAccordionComponent } from '@gnro/ui/accordion';
import { GnroLayoutCenterComponent, GnroLayoutHorizontalComponent, GnroLayoutLeftComponent } from '@gnro/ui/layout';

@Component({
  selector: 'app-entity-tabs',
  templateUrl: './entity-tabs.component.html',
  styleUrls: ['./entity-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    GnroLayoutHorizontalComponent,
    GnroLayoutLeftComponent,
    GnroLayoutCenterComponent,
    GnroAccordionComponent,
  ],
})
export class AppEntityTabsComponent {
  items: GnroAccordion[] = [
    {
      name: 'Entity Tabs',
      items: [
        { name: 'Location Tabs', link: 'location-tabs' },
        { name: 'Simple Tabs', link: 'simple-tabs' },
      ],
    },
  ];
}
