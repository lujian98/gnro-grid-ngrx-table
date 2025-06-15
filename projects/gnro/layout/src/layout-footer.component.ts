import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gnro-layout-footer-start',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroLayoutFooterStartComponent {}

@Component({
  selector: 'gnro-layout-footer-center',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroLayoutFooterCenterComponent {}

@Component({
  selector: 'gnro-layout-footer-end',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroLayoutFooterEndComponent {}

@Component({
  selector: 'gnro-layout-footer',
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroLayoutFooterComponent {}
