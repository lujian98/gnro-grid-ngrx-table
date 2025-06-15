import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroSelectFieldConfig, defaultSelectFieldConfig } from '@gnro/ui/fields';
import { GnroGridCellRendererComponent } from '../grid-cell-renderer.component';

@Component({
  selector: 'gnro-grid-cell-select',
  templateUrl: './grid-cell-select.component.html',
  styleUrls: ['./grid-cell-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
})
export class GnroGridCellSelectComponent<T> extends GnroGridCellRendererComponent<T> {
  get fieldConfig(): GnroSelectFieldConfig {
    const config = this.column.rendererFieldConfig ? this.column.rendererFieldConfig : {};
    return {
      ...defaultSelectFieldConfig,
      ...config,
    };
  }

  get display(): string {
    if (typeof this.data === 'object') {
      const labelKey = this.fieldConfig.optionLabel;
      return (this.data as { [key: string]: string })[labelKey];
    } else {
      return this.data as string;
    }
  }
}
