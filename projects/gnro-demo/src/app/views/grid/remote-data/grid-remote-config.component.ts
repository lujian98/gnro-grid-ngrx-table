import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridConfig, GnroGridComponent, defaultGridConfig } from '@gnro/ui/grid';

@Component({
  selector: 'app-grid-remote-config',
  template: `<gnro-grid [gridConfig]="gridConfig"></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridRemoteConfigComponent {
  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    gridName: 'DCR',
    remoteGridConfig: true,
  };
}
