import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
  input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { GnroObjectType } from '@gnro/ui/core';
import { defaultSelectFieldConfig, defaultTextFieldConfig, GnroFormField } from '@gnro/ui/fields';
import { GnroColumnConfig, GnroGridConfig, GnroGridSetting } from '../../models/grid.model';
import { GnroDateRangeFilterComponent } from './date-range/date-range-filter.component';
import { GnroNumberFilterComponent } from './number/number-filter.component';
import { GnroSelectFilterComponent } from './select/select-filter.component';
import { GnroTextFilterComponent } from './text/text-filter.component';

export interface GnroColumnFilterInstance {
  gridSetting: GnroGridSetting;
  gridConfig: GnroGridConfig;
  fieldConfig: Partial<GnroFormField>;
  column: GnroColumnConfig;
}

@Component({
  selector: 'gnro-column-filter',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroColumnFilterComponent implements OnInit {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private instance!: GnroColumnFilterInstance;
  private _componentRef: ComponentRef<unknown> | undefined;
  gridSetting = input.required({
    transform: (gridSetting: GnroGridSetting) => {
      if (gridSetting && this._componentRef) {
        this.instance.gridSetting = gridSetting;
      }
      return gridSetting;
    },
  });

  column = input.required({
    transform: (column: GnroColumnConfig) => {
      if (column && this._componentRef) {
        if (this.instance.column.name === column.name) {
          this.instance.column = { ...this.instance.column, ...column };
        } else {
          this.loadComponent(column);
        }
      }
      return column;
    },
  });

  gridConfig = input.required({
    transform: (gridConfig: GnroGridConfig) => {
      if (gridConfig && this._componentRef) {
        this.instance.gridConfig = gridConfig;
      }
      return gridConfig;
    },
  });

  ngOnInit(): void {
    this.loadComponent(this.column());
  }

  private loadComponent(column: GnroColumnConfig): void {
    this._componentRef = undefined;
    this.viewContainerRef.clear();
    const filterType = this.getFilterType(column);

    const cellComponent = this.getFilterTypeComponent(filterType);
    this._componentRef = this.viewContainerRef.createComponent(cellComponent);
    this.instance = this._componentRef.instance as GnroColumnFilterInstance;
    if (column.filterFieldConfig) {
      this.instance.fieldConfig = column.filterFieldConfig;
    }
    this.instance.column = column;
    this.instance.gridSetting = this.gridSetting();
    this.instance.gridConfig = this.gridConfig();
  }

  private getFilterType(column: GnroColumnConfig): string {
    if (typeof column.filterField === 'string') {
      return column.filterField;
    } else if (column.filterFieldConfig?.fieldType) {
      return column.filterFieldConfig?.fieldType;
    }
    return GnroObjectType.Text;
  }

  private getFilterTypeComponent(filterType: string): Type<unknown> {
    if (filterType === GnroObjectType.Select) {
      return GnroSelectFilterComponent;
    } else if (filterType === GnroObjectType.Number) {
      return GnroNumberFilterComponent;
    } else if (filterType === GnroObjectType.DateRange) {
      return GnroDateRangeFilterComponent;
    }
    return GnroTextFilterComponent;
  }

  private getFilterFieldConfig(filterType: string, column: GnroColumnConfig): GnroFormField {
    if (filterType === 'select') {
      return {
        ...defaultSelectFieldConfig,
        ...column.filterFieldConfig, // TODO
      };
    }
    return {
      ...defaultTextFieldConfig,
    };
  }
}
