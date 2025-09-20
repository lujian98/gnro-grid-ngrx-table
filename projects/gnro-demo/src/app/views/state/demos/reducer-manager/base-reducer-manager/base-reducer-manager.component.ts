import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ReducerManager } from '@ngrx/store';
import { BaseReducerManagerStateModule } from './+state/base-reducer-manager-state.module';
import { BaseReducerManagerFacade } from './+state/base-reducer-manager.facade';
import { baseReducerManagerReducer } from './+state/base-reducer-manager.reducer';

@Component({
  selector: 'base-reducer-manager',
  templateUrl: './base-reducer-manager.component.html',
  styleUrls: ['./base-reducer-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseReducerManagerStateModule],
})
export class BaseReducerManagerComponent {
  private reducerManager = inject(ReducerManager);
  private readonly baseReducerManagerFacade = inject(BaseReducerManagerFacade);

  data$ = this.baseReducerManagerFacade.getData();

  @Input()
  set featureName(featureName: string) {
    console.log(' featuore name =', featureName);

    this.reducerManager.addReducer(featureName, baseReducerManagerReducer);
    this.baseReducerManagerFacade.featureName$.set(featureName);
    this.data$ = this.baseReducerManagerFacade.getData();
    this.baseReducerManagerFacade.loadData();
  }

  reloadData(): void {
    this.baseReducerManagerFacade.reloadData();
  }
}
