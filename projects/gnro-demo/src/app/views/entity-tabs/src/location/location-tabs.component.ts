import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EntityTabsStateModule } from '../libs/entity-tabs/+state/entity-tabs-state.module';
import { EntityTabsFacade } from '../libs/entity-tabs/+state/entity-tabs.facade';
import { EntityTabsComponent } from '../libs/entity-tabs/entity-tabs.component';
import { FEATURE_NAME } from '../libs/entity-tabs/models/feature-name.enum';
import { AppLocationEntityComponent } from './entity/location-entity.component';

@Component({
  selector: 'app-location-tabs',
  templateUrl: './location-tabs.component.html',
  styleUrls: ['./location-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EntityTabsStateModule, EntityTabsComponent, AppLocationEntityComponent],
})
export class AppLocationTabsComponent {
  private entityTabsFacade = inject(EntityTabsFacade);
  locationEntityComponent = AppLocationEntityComponent;

  constructor() {
    this.entityTabsFacade.initializeFeature(FEATURE_NAME.LOCATIONS);
  }
}
