import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { appStoreActions } from './app-store.actions';
import { selectTotal } from './app-store.selectors';

@Injectable({ providedIn: 'root' })
export class AppStoreFacade {
  //facase can be standalone or extends base facade, and it can access all base actions
  private readonly store = inject(Store);
  total$ = this.store.selectSignal(selectTotal());

  refreshData(): void {
    this.store.dispatch(appStoreActions.refreshData());
  }

  reloadData(): void {
    this.store.dispatch(appStoreActions.reloadData());
  }
}
