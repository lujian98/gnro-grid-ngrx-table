import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as buildPageActions from './build-page.actions';

@Injectable({ providedIn: 'root' })
export class GnroBuildPageFacade {
  private readonly store = inject(Store);

  updateBuildPageConfig(keyName: string, configType: string, configData: object): void {
    this.store.dispatch(buildPageActions.updateBuildPageConfig({ keyName, configType, configData }));
  }
}
