import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppBaseStoreComponent } from './base-store';
import { AppStoreStateModule } from './app-store/+state/app-store-state.module';
import { AppStoreComponent } from './app-store/app-store.component';

@Component({
  selector: 'app-data-store',
  templateUrl: './data-store.component.html',
  styleUrls: ['./data-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppBaseStoreComponent, AppStoreStateModule, AppStoreComponent],
})
export class AppDataStoreComponent {}
