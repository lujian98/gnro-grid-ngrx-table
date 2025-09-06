import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroGridFacade } from '../../../+state/grid.facade';
import {
  ColumnMenuClick,
  GnroColumnConfig,
  GnroGridConfig,
  GnroGridSetting,
  GnroSortField,
} from '../../../models/grid.model';

@Component({
  selector: 'gnro-grid-header-cell',
  templateUrl: './grid-header-cell.component.html',
  styleUrls: ['./grid-header-cell.component.scss'],
  host: {
    '[class.draggable]': 'draggable',
    '[style.height]': 'height$()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, GnroIconModule],
  providers: [GnroGridFacade],
})
export class GnroGridHeaderCellComponent {
  private readonly gridFacade = inject(GnroGridFacade);
  column = input.required<GnroColumnConfig>();
  gridSetting = input.required<GnroGridSetting>();
  gridConfig = input.required<GnroGridConfig>();
  height$ = computed(() => `${this.gridConfig().headerHeight}px`);
  columnMenuClick = output<ColumnMenuClick>();

  get title(): string {
    return this.column().title === undefined ? this.column().name : this.column().title!;
  }

  get findSortField(): GnroSortField | undefined {
    return this.gridConfig().sortFields.find((field) => field.field === this.column().name);
  }

  get isSortField(): boolean {
    return this.column().sortField !== false && !!this.findSortField;
  }

  get sortDir(): string {
    return this.findSortField!.dir;
  }

  get draggable(): boolean {
    return this.gridConfig().columnReorder && this.column().draggable !== false;
  }

  headCellClick(event: MouseEvent): void {
    if (this.gridConfig().columnSort && this.column().sortField !== false) {
      let find = this.findSortField;
      let sort: GnroSortField;
      if (find) {
        sort = { ...find };
        sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sort = {
          field: this.column().name,
          dir: 'asc',
        };
      }
      this.gridFacade.setSortFields(this.gridConfig(), this.gridSetting(), [sort]);
    }
  }

  onClickColumnMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.columnMenuClick.emit({ column: this.column(), event: event });
  }
}
