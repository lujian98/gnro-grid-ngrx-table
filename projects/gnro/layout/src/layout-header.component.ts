import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroButtonConfg } from '@gnro/ui/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gnro-layout-header-end',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroLayoutHeaderEndComponent {}

@Component({
  selector: 'gnro-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, GnroButtonComponent, GnroIconModule],
})
export class GnroLayoutHeaderComponent {
  private readonly router = inject(Router);
  title = input<string | undefined>(undefined);
  buttons = input<GnroButtonConfg[]>([]);
  gnroButtonClick = output<GnroButtonConfg>();

  buttonClick(button: GnroButtonConfg): void {
    if (button.link) {
      this.router.navigate([button.link]);
    }
    this.gnroButtonClick.emit(button);
  }

  getTitle(item: GnroButtonConfg): string {
    return item.title === undefined ? item.name : item.title;
  }
}
