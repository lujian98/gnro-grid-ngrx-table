import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-test2',
  template: `<gnro-grid [gridConfig]="gridConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridTest2Component {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    gridName: 'DCR',
    remoteGridConfig: true,
  };
}
