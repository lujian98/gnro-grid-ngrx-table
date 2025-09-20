import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseReducerManagerStateModule } from './+state/base-reducer-manager-state.module';
import { BaseReducerManagerFacade } from './+state/base-reducer-manager.facade';

@Component({
  selector: 'base-reducer-manager',
  templateUrl: './base-reducer-manager.component.html',
  styleUrls: ['./base-reducer-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseReducerManagerStateModule],
})
export class BaseReducerManagerComponent {
  private readonly baseReducerManagerFacade = inject(BaseReducerManagerFacade);

  data$ = this.baseReducerManagerFacade.getData();

  constructor() {
    this.baseReducerManagerFacade.loadData();
  }

  reloadData(): void {
    this.baseReducerManagerFacade.reloadData();
  }
}
