import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutHeaderComponent, GnroLayoutComponent } from '@gnro/ui/layout';
import { GnroBuildPageStateModule } from './+state/build-page-state.module';
import { GnroBuildPageFacade } from './+state/build-page.facade';

@Component({
  selector: 'gnro-build-page',
  templateUrl: './build-page.component.html',
  styleUrls: ['./build-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GnroBuildPageStateModule,
    GnroLayoutHeaderComponent,
    GnroLayoutComponent,
    GnroButtonComponent,
    GnroIconModule,
  ],
})
export class GnroBuildPageComponent {
  private readonly buildPageFacade = inject(GnroBuildPageFacade);

  keyName = input.required<string>();
  pageConfig = input<object>();
  gridConfig = input<object>();
  columnsConfig = input<object>();

  buildPage(): void {
    console.log('buildPage');
    if (this.pageConfig()) {
      this.buildPageFacade.updateBuildPageConfig(this.keyName(), 'pageConfig', this.pageConfig()!);
    }

    if (this.gridConfig()) {
      this.buildPageFacade.updateBuildPageConfig(this.keyName(), 'gridConfig', this.gridConfig()!);
    }

    if (this.columnsConfig()) {
      this.buildPageFacade.updateBuildPageConfig(this.keyName(), 'columnsConfig', this.columnsConfig()!);
    }
  }
}
