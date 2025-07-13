import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as systemPageConfigActions from './system-page-config.actions';

@Injectable({ providedIn: 'root' })
export class GnroSystemPageConfigFacade {
  private readonly store = inject(Store);

  updateSystemPageConfigConfig(keyName: string, configType: string, configData: object): void {
    this.store.dispatch(systemPageConfigActions.updateSystemPageConfigConfig({ keyName, configType, configData }));
  }
}
