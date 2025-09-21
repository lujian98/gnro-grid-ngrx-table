import { ChangeDetectionStrategy, Component, effect, inject, input, Signal } from '@angular/core';
import { GnroDataType } from '@gnro/ui/core';
import { ReducerManager } from '@ngrx/store';
import { BaseReducerManagerStateModule } from './+state/base-reducer-manager-state.module';
import { BaseReducerManagerFacade } from './+state/base-reducer-manager.facade';
import { baseReducerManagerReducer } from './+state/base-reducer-manager.reducer';
import { BaseReducerManagerConfig } from './config.model';

@Component({
  selector: 'base-reducer-manager',
  templateUrl: './base-reducer-manager.component.html',
  styleUrls: ['./base-reducer-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseReducerManagerStateModule],
})
export class BaseReducerManagerComponent {
  private readonly reducerManager = inject(ReducerManager);
  private readonly baseReducerManagerFacade = inject(BaseReducerManagerFacade);
  data$!: Signal<GnroDataType[]>;
  featureName = input.required<string>();
  config = input.required<BaseReducerManagerConfig>();

  constructor() {
    effect(() => {
      if (this.featureName()) {
        this.initReducerManagerReducer();
      }
    });
  }

  private initReducerManagerReducer(): void {
    this.reducerManager.addReducer(this.featureName(), baseReducerManagerReducer);
    this.baseReducerManagerFacade.loadConfig(this.featureName(), this.config());
    this.data$ = this.baseReducerManagerFacade.getData(this.featureName());
  }

  reloadData(): void {
    this.baseReducerManagerFacade.reloadData(this.featureName());
  }
}
