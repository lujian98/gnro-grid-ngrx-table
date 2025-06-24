import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { GnroMenuConfig, GnroMenusComponent } from '@gnro/ui/menu';
import { GnroGridFacade } from '../../../+state/grid.facade';
import { GnroColumnConfig, GnroGridConfig, GnroGridSetting, GnroRowGroupField } from '../../../models/grid.model';
import { groupColumnMove } from '../../../utils/group-column-move';

@Component({
  selector: 'gnro-grid-column-menu',
  templateUrl: './grid-column-menu.component.html',
  styleUrls: ['./grid-column-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroMenusComponent],
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
  column$ = computed(() => this.columns$().find((col) => col.name === this.column.name));
  values: { [key: string]: boolean } = {}; // checkbox checked
  disabled$ = computed(() => [
    { name: 'asc', disabled: this.sortDisabled('asc') },
    { name: 'desc', disabled: this.sortDisabled('desc') },
    { name: 'sticky', disabled: !!this.column$()?.sticky },
    {
      name: 'stickyEnd',
      disabled: !!this.column$()?.stickyEnd || (this.gridSetting$().isTreeGrid && this.column$()?.name === 'name'),
    },
    {
      name: 'unSticky',
      disabled:
        (!this.column$()?.sticky && !this.column$()?.stickyEnd) ||
        (this.gridSetting$().isTreeGrid && this.column$()?.name === 'name'),
    },
    { name: 'groupBy', disabled: this.groupByDisabled() },
    { name: 'unGroupBy', disabled: this.unGroupByDisabled() },
    { name: 'columns', disabled: false },
  ]);
  menuItems$ = computed(() => {
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
          title: 'GNRO.UI.GRID.STICKY',
          icon: 'circle-left',
        },
        {
          name: 'stickyEnd',
          title: 'GNRO.UI.GRID.STICKY_END',
          icon: 'circle-right',
        },
        {
          name: 'unSticky',
          title: 'GNRO.UI.GRID.UNSTICKY',
          icon: 'circle-xmark',
        },
      );
    }
    if (this.gridConfig$().columnHidden) {
      const columnItems = [...this.columns$()].map((column) => ({
        name: column.name,
        title: column.title,
        keepOpen: true,
        checkbox: true,
        checked: !column.hidden,
        disabled: !this.gridConfig$().columnHidden || column.allowHide === false,
      }));
      menus.push({
        name: 'columns',
        title: 'GNRO.UI.GRID.COLUMNS',
        children: columnItems,
      });
    }
    return menus;
  });

  onMenuFormChanges(values: { [key: string]: boolean }): void {
    this.columnHideShow(values, this.columns$());
  }

  onMenuItemClick(item: GnroMenuConfig): void {
    if (item.name === 'asc' || item.name === 'desc') {
      this.columnSort(item.name);
    } else if (item.name === 'groupBy') {
      const rowGroupField: GnroRowGroupField = { field: this.column.name, dir: 'asc' };
      this.gridFacade.setGridGroupBy(this.gridId, this.gridConfig$(), rowGroupField);
    } else if (item.name === 'unGroupBy') {
      this.gridFacade.setGridUnGroupBy(this.gridId, this.gridConfig$());
    } else if (item.name === 'sticky') {
      this.columnSticky(true, false);
    } else if (item.name === 'stickyEnd') {
      this.columnSticky(false, true);
    } else if (item.name === 'unSticky') {
      this.columnSticky(false, false);
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
    const sort = { field: this.column.name, dir: dir };
    this.gridFacade.setGridSortFields(this.gridConfig$(), this.gridSetting$(), [sort]);
  }

  private columnHideShow(values: { [key: string]: boolean }, columns: GnroColumnConfig[]): void {
    const column = columns.find((col) => {
      const checked = values[col.name];
      const colChecked = !col.hidden;
      return checked !== undefined && checked !== colChecked;
    })!;
    if (column) {
      const col: GnroColumnConfig = { ...column, hidden: !values[column.name] };
      this.gridFacade.setGridColumnConfig(this.gridId, col);
    }
  }

  private columnSticky(sticky: boolean, stickyEnd: boolean): void {
    const columns = [...this.columns$()].map((col) => ({
      ...col,
      sticky: this.isSameGroup(col) ? sticky : col.sticky,
      stickyEnd: this.isSameGroup(col) ? stickyEnd : col.stickyEnd,
    }));
    const previousIndex = columns.findIndex((col) => col.name === this.column.name);
    const currentIndex = this.getCurrentIndex(sticky, stickyEnd, [...columns]);
    if (currentIndex !== undefined) {
      if (this.gridConfig$().groupHeader) {
        const cols = groupColumnMove(previousIndex, currentIndex, [...columns]);
        this.setGridColumnsConfig(cols);
      } else {
        moveItemInArray(columns, previousIndex, currentIndex);
        this.setGridColumnsConfig(columns);
      }
    }
  }

  private setGridColumnsConfig(columns: GnroColumnConfig[]): void {
    this.gridFacade.setGridColumnsConfig(this.gridConfig$(), this.gridSetting$(), columns);
  }

  private isSameGroup(col: GnroColumnConfig): boolean {
    const group = this.column$()?.groupHeader?.name;
    return col.name === this.column.name || !!(group && group === col.groupHeader?.name);
  }

  private getCurrentIndex(sticky: boolean, stickyEnd: boolean, columns: GnroColumnConfig[]): number | undefined {
    if (sticky) {
      return [...this.columns$()].filter((col) => col.sticky).length;
    } else if (stickyEnd) {
      return this.columns$().length - [...this.columns$()].filter((col) => col.stickyEnd).length - 1;
    } else if (this.column$()?.sticky) {
      const findIndex = [...this.columns$()]
        .filter((col) => col.name !== this.column$()?.name)
        .findIndex((col) => col.sticky);
      return findIndex === -1 ? 0 : findIndex + 1;
    } else if (this.column$()?.stickyEnd) {
      return [...this.columns$()].findIndex((col) => col.stickyEnd);
    }
    return undefined;
  }
}
