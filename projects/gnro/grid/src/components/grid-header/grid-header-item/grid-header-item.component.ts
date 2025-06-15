import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gnro-grid-header-item',
  template: '<ng-content></ng-content>',
  styleUrls: ['./grid-header-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridHeaderItemComponent {}
