import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridCellRendererComponent } from '../grid-cell-renderer.component';

@Component({
  selector: 'gnro-grid-cell-image',
  templateUrl: './grid-cell-image.component.html',
  styleUrls: ['./grid-cell-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridCellImageComponent extends GnroGridCellRendererComponent<string> {
  get rowHeight(): number {
    return this.gridConfig.rowHeight - 10;
  }
}
