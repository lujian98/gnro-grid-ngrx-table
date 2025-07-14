import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

export type GnroButtonStatus = 'default' | 'primary' | 'danger';

@Component({
  selector: 'button[gnro-button], a[gnro-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  host: {
    '[class.status-default]': 'status() === "default"',
    '[class.status-primary]': 'status() === "primary"',
    '[class.status-danger]': 'status() === "danger"',
    '[class.appearance-ghost]': 'appearance() === "ghost"',
    '[style.height]': 'height() + "px"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroButtonComponent {
  status = input<GnroButtonStatus>('default');
  ghost = input(false, {
    transform: (ghost: boolean) => {
      this.appearance.set(ghost ? 'ghost' : '');
      return ghost;
    },
  });
  appearance = signal<string>('');
  height = input<number>(28);
}
