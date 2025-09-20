import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppBaseStoreStateModule } from './+state/base-store-state.module';
import { AppBaseStoreFacade } from './+state/base-store.facade';

@Component({
  selector: 'app-base-store',
  templateUrl: './base-store.component.html',
  styleUrls: ['./base-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppBaseStoreStateModule],
})
export class AppBaseStoreComponent {
  private readonly appBaseStoreFacade = inject(AppBaseStoreFacade);

  data$ = this.appBaseStoreFacade.getData();

  constructor() {
    this.appBaseStoreFacade.loadData();
  }

  reloadData(): void {
    this.appBaseStoreFacade.reloadData();
  }
}
