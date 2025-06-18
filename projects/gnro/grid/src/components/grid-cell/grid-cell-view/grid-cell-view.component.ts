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
import { GnroColumnConfig, GnroGridCell, GnroGridConfig } from '../../../models/grid.model';
import { GnroGridCellDateComponent } from './renderer/date/grid-cell-date.component';
import { GnroGridCellFunctionComponent } from './renderer/function/grid-cell-function.component';
import { GnroGridCellImageComponent } from './renderer/image/grid-cell-image.component';
import { GnroGridCellNumberComponent } from './renderer/number/grid-cell-number.component';
import { GnroGridCellSelectComponent } from './renderer/select/grid-cell-select.component';
import { GnroGridCellTextComponent } from './renderer/text/grid-cell-text.component';

@Component({
  selector: 'gnro-grid-cell-view',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridCellViewComponent<T> implements OnInit {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private instance!: GnroGridCell<T>;
  private _componentRef!: ComponentRef<unknown>;
  gridConfig = input.required<GnroGridConfig>();
  rowIndex = input<number>(0);
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
    this.instance.gridConfig = this.gridConfig();
    this.instance.rowIndex = this.rowIndex();
    this.instance.column = column;
    this.instance.record = this.record();
  }

  private getRenderer(column: GnroColumnConfig): Type<unknown> {
    switch (column.rendererType) {
      case GnroObjectType.Text:
        return GnroGridCellTextComponent;
      case GnroObjectType.Select:
        return GnroGridCellSelectComponent;
      case GnroObjectType.Date:
        return GnroGridCellDateComponent;
      case GnroObjectType.Number:
        return GnroGridCellNumberComponent;
      case GnroObjectType.Image:
        return GnroGridCellImageComponent;
      case GnroObjectType.Function:
        if (column.renderer) {
          return GnroGridCellFunctionComponent;
        }
        break;
      case GnroObjectType.Component:
        if (column.component) {
          return column.component!;
        }
        break;
      default:
        break;
    }
    return GnroGridCellTextComponent;
  }
}
