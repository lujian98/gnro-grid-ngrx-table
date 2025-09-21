import { ChangeDetectionStrategy, Component, inject, input, Signal } from '@angular/core';
import { ReducerManager } from '@ngrx/store';
import { GnroDataType } from '@gnro/ui/core';
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
  data$!: Signal<GnroDataType[]>;

  featureName = input.required({
    transform: (featureName: string) => {
      this.reducerManager.addReducer(featureName, baseReducerManagerReducer);
      this.data$ = this.baseReducerManagerFacade.getData(featureName);
      this.baseReducerManagerFacade.loadData(featureName);
      return featureName;
    },
  });

  reloadData(): void {
    this.baseReducerManagerFacade.reloadData(this.featureName());
  }
}
