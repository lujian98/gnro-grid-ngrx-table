import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroGridFacade } from '../../+state/grid.facade';
import { GnroColumnConfig, GnroGridConfig, GnroGridSetting } from '../../models/grid.model';
import { GnroRowGroup } from '../../utils/row-group/row-group';

@Component({
  selector: 'gnro-grid-row-group',
  templateUrl: './grid-row-group.component.html',
  styleUrls: ['./grid-row-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.gnro-grid-row]': 'gnroGridRow',
  },
  imports: [TranslatePipe, GnroIconModule],
})
export class GnroGridRowGroupComponent<T> {
  private readonly gridFacade = inject(GnroGridFacade);
  columns = input.required<GnroColumnConfig[]>();
  gridSetting = input.required<GnroGridSetting>();
  gridConfig = input.required<GnroGridConfig>();
  rowIndex = input.required<number>();
  columnHeaderPosition = input<number>(0);
  record = input.required<T | GnroRowGroup>();
  onToggleRowGroup = output<GnroRowGroup>();
  rowGroup!: GnroRowGroup;
  rowGroup$ = computed(() => {
    if (this.record() instanceof GnroRowGroup) {
      this.rowGroup = this.record() as GnroRowGroup;
      return this.record() as GnroRowGroup;
    } else {
      return undefined;
    }
  });

  get title(): string {
    const column = this.columns().find((item) => item.name === this.rowGroup.field)!;
    return column.title || column.name;
  }

  toggleRowGroup(): void {
    this.rowGroup.expanded = !this.rowGroup.expanded;
    this.gridFacade.setToggleRowGroup(this.gridSetting().gridId, this.rowGroup);
    this.onToggleRowGroup.emit(this.rowGroup);
  }

  get gnroGridRow(): boolean {
    return true;
  }
}
