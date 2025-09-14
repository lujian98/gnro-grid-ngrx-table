import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppStoreFacade } from './+state/app-store.facade';

@Component({
  selector: 'app-store',
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppStoreComponent {
  private readonly appStoreFacade = inject(AppStoreFacade);

  refresh(): void {
    this.appStoreFacade.refreshData();
  }
}
