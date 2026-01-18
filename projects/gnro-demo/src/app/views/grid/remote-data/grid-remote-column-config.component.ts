import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-remote-column-config',
  template: `<gnro-grid [gridConfig]="gridConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridRemoteColumnConfigComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    gridName: 'DCR',
    remoteColumnsConfig: true,
    columnMenu: true,
    columnSort: true,
    columnHidden: true,
    remoteGridData: true,
  };
}
