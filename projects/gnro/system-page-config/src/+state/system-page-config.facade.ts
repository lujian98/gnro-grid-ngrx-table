import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { systemPageConfigActions } from './system-page-config.actions';

@Injectable({ providedIn: 'root' })
export class GnroSystemPageConfigFacade {
  private readonly store = inject(Store);

  update(keyName: string, configType: string, configData: object): void {
    this.store.dispatch(systemPageConfigActions.update({ keyName, configType, configData }));
  }
}
