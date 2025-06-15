import { ChangeDetectionStrategy, Component } from '@angular/core';
import { isNumeric } from '@gnro/ui/core';
import { GnroNumberFieldConfig, defaultNumberFieldConfig } from '@gnro/ui/fields';
import { GnroGridCellRendererComponent } from '../grid-cell-renderer.component';

@Component({
  selector: 'gnro-grid-cell-number',
  templateUrl: './grid-cell-number.component.html',
  styleUrls: ['./grid-cell-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroGridCellNumberComponent extends GnroGridCellRendererComponent<number> {
  get fieldConfig(): GnroNumberFieldConfig {
    const config = this.column.rendererFieldConfig ? this.column.rendererFieldConfig : {};
    return {
      ...defaultNumberFieldConfig,
      ...config,
    };
  }

  get display(): number | string {
    if (isNumeric(this.data)) {
      return this.data.toFixed(this.fieldConfig.decimals);
    } else {
      return '';
    }
  }
}
