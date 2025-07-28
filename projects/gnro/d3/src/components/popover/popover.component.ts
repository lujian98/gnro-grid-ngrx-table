import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroD3Popover } from '../../models';

@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroD3PopoverComponent {
  data!: GnroD3Popover;
}
