import { inject, Injectable, Signal } from '@angular/core';
import { GrnoDataType } from '@gnro/ui/core';
import { Store } from '@ngrx/store';
import { appBaseStoreActions } from './base-store.actions';
import { selectData } from './base-store.selectors';

@Injectable({ providedIn: 'root' })
export class AppBaseStoreFacade {
  private readonly store = inject(Store);

  loadData(): void {
    this.store.dispatch(appBaseStoreActions.loadData());
  }

  getData(): Signal<GrnoDataType[]> {
    return this.store.selectSignal(selectData);
  }
}
