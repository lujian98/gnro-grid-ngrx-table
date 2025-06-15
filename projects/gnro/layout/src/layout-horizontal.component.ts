import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { uniqueId } from '@gnro/ui/core';
import { GnroResizeDirective, GnroResizeInfo, GnroResizeType } from '@gnro/ui/resize';
import { take, timer } from 'rxjs';

@Component({
  selector: 'gnro-layout-left',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroLayoutLeftComponent {}

@Component({
  selector: 'gnro-layout-center',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroLayoutCenterComponent {}

@Component({
  selector: 'gnro-layout-right',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroLayoutRightComponent {}

@Component({
  selector: 'gnro-layout-horizontal',
  templateUrl: './layout-horizontal.component.html',
  styleUrls: ['./layout-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroResizeDirective],
})
export class GnroLayoutHorizontalComponent<T> implements AfterViewInit {
  private elementRef = inject(ElementRef);
  elementKey = uniqueId(16);
  resizeType = GnroResizeType;
  resizeable = input<boolean>(false);

  @ViewChild('tplResizeLeftRight', { static: true }) tplResizeLeftRight!: TemplateRef<T>;
  @ViewChild('tplResizeRightLeft', { static: true }) tplResizeRightLeft!: TemplateRef<T>;
  @ViewChild('contentResizeLeftRight', { read: ViewContainerRef }) contentResizeLeftRight!: ViewContainerRef;
  @ViewChild('contentResizeRightLeft', { read: ViewContainerRef }) contentResizeRightLeft!: ViewContainerRef;

  ngAfterViewInit(): void {
    if (this.resizeable()) {
      this.checkResizeCondition();
    }
  }

  private checkResizeCondition(): void {
    const left = this.getPanelEl('left');
    const center = this.getPanelEl('center');
    const right = this.getPanelEl('right');
    if (left && (center || right)) {
      this.contentResizeLeftRight.createEmbeddedView(this.tplResizeLeftRight);
    }
    if (right && center) {
      this.contentResizeRightLeft.createEmbeddedView(this.tplResizeRightLeft);
    }
  }

  togglePanel(panel: string): void {
    const el = this.getPanelEl(panel);
    if (el) {
      const style = window.getComputedStyle(el);
      const display = style.display === 'flex' ? 'none' : 'flex';
      el.style.setProperty('display', display);
      window.dispatchEvent(new Event('resize'));
    }
  }

  private getPanelEl(panel: string): HTMLDivElement | undefined {
    const elements: HTMLDivElement[] = Array.from(this.elementRef.nativeElement.children);
    return elements.find((el) => el.localName === `gnro-layout-${panel}`);
  }

  onResizePanel(resizeInfo: GnroResizeInfo): void {
    if (resizeInfo.isResized) {
      timer(500)
        .pipe(take(1))
        .subscribe(() => {
          window.dispatchEvent(new Event('resize'));
        });
    }
  }
}
