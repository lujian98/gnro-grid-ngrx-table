import { Injectable, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GrnoDataType } from '@gnro/ui/core';
import { appStoreActions } from './app-store.actions';
//import { selectData } from './app-store.selectors';

@Injectable({ providedIn: 'root' })
export class AppBaseStoreFacade {
  private readonly store = inject(Store);

  loadData(): void {
    // this.store.dispatch(appBaseStoreActions.loadData());
  }

  /*
  getData(): Signal<GrnoDataType[]> {
    return this.store.selectSignal(selectData);
  }*/
}
