import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { appStoreActions } from './app-store.actions';

@Injectable({ providedIn: 'root' })
export class AppStoreFacade {
  private readonly store = inject(Store);

  refreshData(): void {
    this.store.dispatch(appStoreActions.refreshData());
  }
}
