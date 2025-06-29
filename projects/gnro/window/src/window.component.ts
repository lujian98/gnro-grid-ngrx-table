import { CdkDrag, CdkDragEnd, CdkDragHandle } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { uniqueId } from '@gnro/ui/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroResizeDirective, GnroResizeInfo, GnroResizeType } from '@gnro/ui/resize';
import { GNRO_DOCUMENT } from '@gnro/ui/theme';
import { take, timer } from 'rxjs';
import { defaultWindowConfig, GnroWindowConfig, GnroWindowInfo } from './models/window.model';

@Component({
  selector: 'gnro-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GnroIconModule,
    CdkDrag,
    CdkDragHandle,
    GnroResizeDirective,
    GnroButtonComponent,
    GnroLayoutHeaderComponent,
  ],
})
export class GnroWindowComponent<T> {
  private readonly dialogRef = inject(GnroDialogRef<T>);
  private readonly document = inject(GNRO_DOCUMENT);
  private readonly elementRef = inject(ElementRef);
  private windowInfo!: GnroWindowInfo;

  resizeType = GnroResizeType;
  elementKey = uniqueId(16);
  windowConfig = input.required({
    transform: (val: GnroWindowConfig) => {
      const windowConfig = { ...defaultWindowConfig, ...val };
      this.setWindow(windowConfig);
      return windowConfig;
    },
  });

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  get overlay(): HTMLElement {
    return this.document.querySelector('.cdk-overlay-container')!;
  }

  get overlayPane(): HTMLElement {
    return this.elementRef.nativeElement.parentNode.parentNode.parentNode;
  }

  get isMaxWindowSize(): boolean {
    return (
      this.element.clientWidth === this.overlay.clientWidth && this.element.clientHeight === this.overlay.clientHeight
    );
  }

  private setWindow(windowConfig: GnroWindowConfig): void {
    const height = windowConfig.height;
    if (height) {
      this.setHeight(parseFloat(height));
    }
    if (windowConfig.width) {
      this.setWidth(parseFloat(windowConfig.width));
    }

    timer(10)
      .pipe(take(1))
      .subscribe(() => this.initWindow());
  }

  private initWindow(): void {
    const width = this.overlay.clientWidth;
    const height = this.overlay.clientHeight;
    const w = this.element.clientWidth;
    const h = this.element.clientHeight;
    const topAdjust = h < height / 2 ? 4 : 2;
    const left = width < w ? 0 : (width - w) / 2;
    const top = height < h ? 0 : (height - h) / topAdjust;
    this.setWindowInfo(left, top);
  }

  dragEnded(event: CdkDragEnd): void {
    const transformValue = this.overlayPane.style.transform;
    const values = transformValue.replaceAll('translate3d(', '').replaceAll(')', ',').split(',');
    const left = parseFloat(values[0]) + parseFloat(values[3]);
    const top = parseFloat(values[1]) + parseFloat(values[4]);
    //this.setWindowInfo(left, top, false);
  }

  maximize(): void {
    this.overlayPane.style.transform = `translate3d(0px, 0px, 0px)`;
    this.setOverlayPaneTransform(0, 0);
    this.setHeight(this.overlay.clientHeight);
    this.setWidth(this.overlay.clientWidth);
  }

  restore(): void {
    this.setOverlayPaneTransform(this.windowInfo.left, this.windowInfo.top);
    this.setHeight(this.windowInfo.height);
    this.setWidth(this.windowInfo.width);
  }

  close(): void {
    this.dialogRef.close();
  }

  onResizePanel(resizeInfo: GnroResizeInfo): void {
    if (resizeInfo.isResized) {
      this.setWindowPosition(resizeInfo);
      this.setHeight(resizeInfo.height * resizeInfo.scaleY);
      this.setWidth(resizeInfo.width * resizeInfo.scaleX);
    }
  }

  private setWindowPosition(resizeInfo: GnroResizeInfo): void {
    const left = this.windowInfo.left;
    const top = this.windowInfo.top;
    switch (resizeInfo.direction) {
      case GnroResizeType.TOP:
      case GnroResizeType.TOP_RIGHT:
        this.setWindowInfo(left, top + resizeInfo.dy);
        break;
      case GnroResizeType.LEFT:
      case GnroResizeType.BOTTOM_LEFT:
        this.setWindowInfo(left + resizeInfo.dx, top);
        break;
      case GnroResizeType.TOP_LEFT:
        this.setWindowInfo(left + resizeInfo.dx, top + resizeInfo.dy);
        break;
    }
  }

  private setWindowInfo(left: number, top: number, setTransform: boolean = true): void {
    /*
    left = left < -this.element.clientWidth + 20 ? -this.element.clientWidth + 20 : left;
    left = left > this.overlay.clientWidth - 20 ? this.overlay.clientWidth - 20 : left;
    top = top < 0 ? 0 : top;
    top = top > this.overlay.clientHeight - 20 ? this.overlay.clientHeight - 20 : top;
    */
    this.windowInfo = {
      left: left,
      top: top,
      width: this.element.clientWidth,
      height: this.element.clientHeight,
    };
    if (setTransform) {
      console.log(' xxxxxxxxxxxx ');
      this.setOverlayPaneTransform(left, top);
    }
  }

  private setOverlayPaneTransform(left: number, top: number): void {
    this.element.style.transform = `translate3d(${left}px, ${top}px, 0px)`;
  }

  private setHeight(height: number): void {
    const el = this.element;
    if (el) {
      el.style.height = `${height}px`;
    }
  }

  private setWidth(width: number): void {
    const el = this.element;
    if (el) {
      el.style.width = `${width}px`;
    }
  }
}
