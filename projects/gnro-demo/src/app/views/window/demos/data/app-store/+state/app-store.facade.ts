import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { appStoreActions } from './app-store.actions';
import { selectTotal } from './app-store.selectors';

@Injectable({ providedIn: 'root' })
export class AppStoreFacade {
  private readonly store = inject(Store);
  total$ = this.store.selectSignal(selectTotal());

  refreshData(): void {
    this.store.dispatch(appStoreActions.refreshData());
  }
}
