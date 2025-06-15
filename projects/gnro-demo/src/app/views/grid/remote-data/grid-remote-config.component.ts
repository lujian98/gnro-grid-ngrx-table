import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccGridConfig, IccGridComponent, defaultGridConfig } from '@icc/ui/grid';

@Component({
  selector: 'app-grid-remote-config',
  template: `<icc-grid [gridConfig]="gridConfig"></icc-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccGridComponent],
})
export class AppGridRemoteConfigComponent {
  gridConfig: IccGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
    remoteGridConfig: true,
  };
}
