import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridCellRendererComponent } from '../grid-cell-renderer.component';

@Component({
  selector: 'gnro-grid-cell-function',
  templateUrl: './grid-cell-function.component.html',
  styleUrls: ['./grid-cell-function.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridCellFunctionComponent extends GnroGridCellRendererComponent<string> {
  get display(): string {
    return this.column.renderer!(this.data, this.column.name, this.column, this.record, this.rowIndex);
  }
}
