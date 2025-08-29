import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { GnroBackendService, GnroButtonConfg } from '@gnro/ui/core';
import { openRemoteImportsWindowAction } from './imports.actions';
import { GnroGridFacade } from '@gnro/ui/grid';

@Injectable({ providedIn: 'root' })
export class GnroImportsFacade {
  private readonly store = inject(Store);
  private readonly backendService = inject(GnroBackendService);
  private readonly gridFacade = inject(GnroGridFacade);

  imports(gridId: string): void {
    const gridConfig = this.gridFacade.getGridConfig(gridId)();
    console.log(' gridConfig=', gridConfig);
    let params = this.backendService.getParams(gridConfig.urlKey, 'imports');
    this.store.dispatch(openRemoteImportsWindowAction({ stateId: gridId, keyName: gridConfig.urlKey, params }));
  }
}
