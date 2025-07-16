import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { updateSystemPageConfigConfigAction } from './system-page-config.actions';

@Injectable({ providedIn: 'root' })
export class GnroSystemPageConfigFacade {
  private readonly store = inject(Store);

  updateSystemPageConfigConfig(keyName: string, configType: string, configData: object): void {
    this.store.dispatch(updateSystemPageConfigConfigAction({ keyName, configType, configData }));
  }
}
