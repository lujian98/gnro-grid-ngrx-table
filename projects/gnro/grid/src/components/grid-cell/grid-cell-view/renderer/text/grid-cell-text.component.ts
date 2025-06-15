import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroGridCellRendererComponent } from '../grid-cell-renderer.component';

@Component({
  selector: 'gnro-grid-cell-text',
  templateUrl: './grid-cell-text.component.html',
  styleUrls: ['./grid-cell-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridCellTextComponent extends GnroGridCellRendererComponent<string> {}
