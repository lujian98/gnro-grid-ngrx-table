import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroD3Popover } from '../../models';

@Component({
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroD3PopoverComponent2 implements OnInit {
  data!: GnroD3Popover; // TODO hover border color

  ngOnInit(): void {}

  close(): void {
    // this.overlayComponentRef.close({ id: 1 });
    // TODO this may not be enough to close tooltip need add close events subject to popover directive
  }
}
