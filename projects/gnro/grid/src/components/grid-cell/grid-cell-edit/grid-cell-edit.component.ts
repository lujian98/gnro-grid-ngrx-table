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
import { GnroColumnConfig, GnroGridCell, GnroGridConfig, GnroGridSetting } from '../../../models/grid.model';
import { GnroCellEditDateComponent } from './cell-edit/date/cell-edit-date.component';
import { GnroCellEditNumberComponent } from './cell-edit/number/cell-edit-number.component';
import { GnroCellEditSelectComponent } from './cell-edit/select/cell-edit-select.component';
import { GnroCellEditTextComponent } from './cell-edit/text/cell-edit-text.component';

@Component({
  selector: 'gnro-grid-cell-edit',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridCellEditComponent<T> implements OnInit {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private instance!: GnroGridCell<T>;
  private _componentRef!: ComponentRef<unknown>;
  rowIndex = input<number>(0);
  gridConfig = input.required({
    transform: (gridConfig: GnroGridConfig) => {
      if (gridConfig && this._componentRef) {
        this.instance.gridConfig = gridConfig;
      }
      return gridConfig;
    },
  });
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
        this.loadComponent(column);
      }
      return column;
    },
  });
  record = input.required({
    transform: (record: T) => {
      if (record && this._componentRef) {
        this.instance.record = record;
      }
      return record;
    },
  });

  ngOnInit(): void {
    this.loadComponent(this.column());
  }

  private loadComponent(column: GnroColumnConfig): void {
    this.viewContainerRef.clear();
    const cellComponent = this.getRenderer(column);
    this._componentRef = this.viewContainerRef.createComponent(cellComponent);
    this.instance = this._componentRef.instance as GnroGridCell<T>;
    this.instance.column = column;
    this.instance.rowIndex = this.rowIndex();
    this.instance.record = this.record();
    this.instance.gridConfig = this.gridConfig();
    this.instance.gridSetting = this.gridSetting();
  }

  private getRenderer(column: GnroColumnConfig): Type<unknown> {
    switch (column.rendererType) {
      case GnroObjectType.Text:
        return GnroCellEditTextComponent;
      case GnroObjectType.Select:
        return GnroCellEditSelectComponent;
      case GnroObjectType.Date:
        return GnroCellEditDateComponent;
      case GnroObjectType.Number:
        return GnroCellEditNumberComponent;
      default:
        break;
    }
    return GnroCellEditTextComponent;
  }
}
