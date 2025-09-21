import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BaseReducerManagerComponent,
  BaseReducerManagerStateModule,
  BaseReducerManagerConfig,
} from './base-reducer-manager';

@Component({
  selector: 'app-reducer-manager',
  templateUrl: './app-reducer-manager.component.html',
  styleUrls: ['./app-reducer-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseReducerManagerComponent, BaseReducerManagerStateModule],
})
export class AppReducerManagerComponent {
  featureName = 'testBaseReducerManager';

  config: BaseReducerManagerConfig = {
    pageSize: 20,
  };

  featureName2 = 'testBaseReducerManager2';

  config2: BaseReducerManagerConfig = {
    pageSize: 30,
  };
}
