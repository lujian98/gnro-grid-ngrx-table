import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppBaseStoreComponent } from './base-store';
import { AppStoreStateModule } from './app-store/+state/app-store-state.module';
import { AppStoreFacade } from './app-store/+state/app-store.facade';

@Component({
  selector: 'app-data-store',
  templateUrl: './data-store.component.html',
  styleUrls: ['./data-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppBaseStoreComponent, AppStoreStateModule],
})
export class AppDataStoreComponent {
  private readonly appStoreFacade = inject(AppStoreFacade);

  refresh(): void {
    this.appStoreFacade.refreshData();
  }
}
