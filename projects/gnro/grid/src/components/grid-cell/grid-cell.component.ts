import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gnro-grid-cell',
  template: '<ng-content></ng-content>',
  styleUrls: ['./grid-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridCellComponent {}
