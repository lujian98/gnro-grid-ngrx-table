import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gnro-grid-cell',
  template: '<ng-content></ng-content>',
  styleUrls: ['./grid-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sticky]': 'sticky()',
    '[class.row-even-sticky]': 'sticky() && rowIndex() % 2 === 1',
    '[class.row-odd-sticky]': 'sticky() && rowIndex() % 2 === 0',
    '[class.selected]': 'sticky() && selected()',
  },
})
export class GnroGridCellComponent {
  sticky = input<boolean>(false);
  selected = input<boolean>(false);
  rowIndex = input<number>(0);
}
