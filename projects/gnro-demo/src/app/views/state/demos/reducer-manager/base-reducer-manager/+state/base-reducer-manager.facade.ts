import { inject, Injectable, Signal, signal } from '@angular/core';
import { GnroDataType } from '@gnro/ui/core';
import { Store } from '@ngrx/store';
import { baseReducerManagerActions } from './base-reducer-manager.actions';
import { selectData } from './base-reducer-manager.selectors';

@Injectable({ providedIn: 'root' })
export class BaseReducerManagerFacade {
  private readonly store = inject(Store);

  featureName$ = signal<string>('');

  loadData(): void {
    this.store.dispatch(baseReducerManagerActions.loadData());
  }

  reloadData(): void {
    this.store.dispatch(baseReducerManagerActions.reloadData());
  }

  getData(): Signal<GnroDataType[]> {
    return this.store.selectSignal(selectData(this.featureName$()));
  }
}
