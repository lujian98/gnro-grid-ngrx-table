import { inject, Injectable, Signal } from '@angular/core';
import { GnroDataType } from '@gnro/ui/core';
import { Store } from '@ngrx/store';
import { baseReducerManagerActions } from './base-reducer-manager.actions';
import { selectData } from './base-reducer-manager.selectors';

@Injectable({ providedIn: 'root' })
export class BaseReducerManagerFacade {
  private readonly store = inject(Store);

  loadData(featureName: string): void {
    this.store.dispatch(baseReducerManagerActions.loadData({ featureName }));
  }

  reloadData(featureName: string): void {
    this.store.dispatch(baseReducerManagerActions.reloadData({ featureName }));
  }

  getData(featureName: string): Signal<GnroDataType[]> {
    return this.store.selectSignal(selectData(featureName));
  }
}
