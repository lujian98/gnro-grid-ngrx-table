import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { GnroDisabled } from '@gnro/ui/core';
import { GnroMenuConfig, GnroMenusComponent } from '@gnro/ui/menu';
import { GnroGridStateModule } from '../../../+state/grid-state.module';
import { GnroGridFacade } from '../../../+state/grid.facade';
import { GnroColumnConfig, GnroGridConfig, GnroGridSetting, GnroRowGroupField } from '../../../models/grid.model';

@Component({
  selector: 'gnro-grid-column-menu',
  templateUrl: './grid-column-menu.component.html',
  styleUrls: ['./grid-column-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroGridStateModule, GnroMenusComponent],
})
export class GnroGridColumnMenuComponent {
  private readonly gridFacade = inject(GnroGridFacade);
  private _gridId!: string;
  level = 0;
  gridConfig$!: Signal<GnroGridConfig>;
  gridSetting$!: Signal<GnroGridSetting>;
  columns$!: Signal<GnroColumnConfig[]>;

  set gridId(val: string) {
    this._gridId = val;
    if (!this.gridConfig$) {
      this.gridConfig$ = this.gridFacade.getGridConfig(this.gridId);
    }
    if (!this.gridSetting$) {
      this.gridSetting$ = this.gridFacade.getSetting(this.gridId);
    }
    if (!this.columns$) {
      this.columns$ = this.gridFacade.getColumnsConfig(this.gridId);
    }
  }
  get gridId(): string {
    return this._gridId;
  }
  column!: GnroColumnConfig;
  menuItems: GnroMenuConfig[] = [];
  set columns(columns: GnroColumnConfig[]) {
    this.menuItems = this.getMenuItems(columns);
  }
  values: { [key: string]: boolean } = {};
  disabled = computed(() => {
    return this.getDisabledMenu();
  });

  private getDisabledMenu(): GnroDisabled[] {
    return [
      {
        name: 'asc',
        disabled: this.sortDisabled('asc'),
      },
      {
        name: 'desc',
        disabled: this.sortDisabled('desc'),
      },
      {
        name: 'groupBy',
        disabled: this.groupByDisabled(),
      },
      {
        name: 'unGroupBy',
        disabled: this.unGroupByDisabled(),
      },
      {
        name: 'columns',
        disabled: false,
      },
    ];
  }

  private getMenuItems(columns: GnroColumnConfig[]): GnroMenuConfig[] {
    const menus = [];
    menus.push(
      {
        name: 'asc',
        title: 'GNRO.UI.GRID.SORT_ASCENDING',
        icon: 'arrow-up-short-wide',
        disabled: this.sortDisabled('asc'),
      },
      {
        name: 'desc',
        title: 'GNRO.UI.GRID.SORT_DESCENDING',
        icon: 'arrow-down-wide-short',
        disabled: this.sortDisabled('desc'),
      },
    );

    if (this.gridConfig$().rowGroup) {
      menus.push(
        {
          name: 'groupBy',
          title: 'GNRO.UI.GRID.GROUP_BY_THIS_FIELD',
          icon: 'arrow-down-wide-short',
          disabled: this.groupByDisabled(),
        },
        {
          name: 'unGroupBy',
          title: 'GNRO.UI.GRID.UNGROUP',
          icon: 'arrow-down-wide-short',
          disabled: this.unGroupByDisabled(),
        },
      );
    }

    if (this.gridConfig$().columnSticky) {
      menus.push(
        {
          name: 'sticky',
          title: 'Sticky',
          icon: 'arrow-down-wide-short',
          //disabled: this.groupByDisabled(),
        },
        {
          name: 'unSticky',
          title: 'Unsticky',
          icon: 'arrow-down-wide-short',
          //disabled: this.groupByDisabled(),
        },
      );
    }
    const columnItems = [...columns].map((column) => {
      return {
        name: column.name,
        title: column.title,
        keepOpen: true,
        checkbox: true,
        checked: !column.hidden,
        disabled: !this.gridConfig$().columnHidden || column.allowHide === false,
      };
    });
    menus.push({
      name: 'columns',
      title: 'GNRO.UI.GRID.COLUMNS',
      children: columnItems,
    });
    return menus;
  }

  onMenuFormChanges(values: { [key: string]: boolean }): void {
    this.columnHideShow(values, this.columns$());
  }

  onMenuItemClick(item: GnroMenuConfig): void {
    if (item.name === 'asc' || item.name === 'desc') {
      this.columnSort(item.name);
    } else if (item.name === 'groupBy') {
      const rowGroupField: GnroRowGroupField = {
        field: this.column.name,
        dir: 'asc',
      };
      this.gridFacade.setGridGroupBy(this.gridId, this.gridConfig$(), rowGroupField);
    } else if (item.name === 'unGroupBy') {
      this.gridFacade.setGridUnGroupBy(this.gridId, this.gridConfig$());
    } else if (item.name === 'sticky') {
      this.columnSticky(true);
    } else if (item.name === 'unSticky') {
      this.columnSticky(false);
    }
  }

  private groupByDisabled(): boolean {
    const rowGroupField = this.gridConfig$().rowGroupField;
    return (
      !this.gridConfig$().rowGroup ||
      this.column.groupField === false ||
      !!(rowGroupField && rowGroupField.field === this.column.name)
    );
  }

  private unGroupByDisabled(): boolean {
    return !this.gridConfig$().rowGroupField;
  }

  private sortDisabled(dir: string): boolean {
    const sortField = this.gridConfig$().sortFields.find((field) => field.field === this.column.name);
    return !this.gridConfig$().columnSort || this.column.sortField === false || (!!sortField && sortField.dir === dir);
  }

  private columnSort(dir: string): void {
    const sort = {
      field: this.column.name,
      dir: dir,
    };
    this.gridFacade.setGridSortFields(this.gridConfig$(), this.gridSetting$(), [sort]);
  }

  private columnHideShow(values: { [key: string]: boolean }, columns: GnroColumnConfig[]): void {
    const column = columns.find((col) => {
      const checked = values[col.name];
      const colChecked = !col.hidden;
      return checked !== undefined && checked !== colChecked;
    })!;
    if (column) {
      const col: GnroColumnConfig = {
        ...column,
        hidden: !values[column.name],
      };
      this.gridFacade.setGridColumnConfig(this.gridId, col);
    }
  }

  private columnSticky(sticky: boolean): void {
    const columns = [...this.columns$()].map((col) => {
      return {
        ...col,
        sticky: col.name === this.column.name ? sticky : col.sticky,
      };
    });
    this.gridFacade.setGridColumnsConfig(this.gridConfig$(), this.gridSetting$(), columns);
  }
}
