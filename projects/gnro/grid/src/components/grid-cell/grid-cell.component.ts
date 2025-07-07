import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { GnroColumnConfig, GnroColumnWidth, GnroGridConfig, GnroGridSetting } from '../../models/grid.model';

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

    '[style.height]': 'height$()',
  },
})
export class GnroGridCellComponent {
  gridConfig = input.required<GnroGridConfig>();
  sticky = input.required<boolean>();
  selected = input.required<boolean>();
  rowIndex = input.required<number>();
  //colIndex = input.required<number>();
  column = input.required<GnroColumnConfig | string>();

  columns = input.required<GnroColumnConfig[]>();
  columnWidths = input.required<GnroColumnWidth[]>();

  height$ = computed(() => `${this.gridConfig().rowHeight}px`);
}
