import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutHeaderComponent, GnroLayoutComponent } from '@gnro/ui/layout';
import { GnroSystemPageConfigStateModule } from './+state/system-page-config-state.module';
import { GnroSystemPageConfigFacade } from './+state/system-page-config.facade';

@Component({
  selector: 'gnro-system-page-config',
  templateUrl: './system-page-config.component.html',
  styleUrls: ['./system-page-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GnroSystemPageConfigStateModule,
    GnroLayoutHeaderComponent,
    GnroLayoutComponent,
    GnroButtonComponent,
    GnroIconModule,
  ],
})
export class GnroSystemPageConfigComponent {
  private readonly systemPageConfigFacade = inject(GnroSystemPageConfigFacade);

  keyName = input.required<string>();
  pageConfig = input<object>();
  gridConfig = input<object>();
  columnsConfig = input<object>();

  systemPageConfig(): void {
    if (this.pageConfig()) {
      this.systemPageConfigFacade.update(this.keyName(), 'pageConfig', this.pageConfig()!);
    }

    if (this.gridConfig()) {
      this.systemPageConfigFacade.update(this.keyName(), 'gridConfig', this.gridConfig()!);
    }

    if (this.columnsConfig()) {
      this.systemPageConfigFacade.update(this.keyName(), 'columnsConfig', this.columnsConfig()!);
    }
  }
}
