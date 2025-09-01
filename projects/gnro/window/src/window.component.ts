import { CdkDrag, CdkDragEnd, CdkDragHandle } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { uniqueId } from '@gnro/ui/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroResizeDirective, GnroResizeInfo, GnroResizeType } from '@gnro/ui/resize';
import { GNRO_DOCUMENT } from '@gnro/ui/theme';
import { take, timer } from 'rxjs';
import {
  defaultWindowConfig,
  GnroWindowConfig,
  GnroWindowInfo,
  GnroPositionType,
  GnroTopLeft,
} from './models/window.model';

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
  private overlayPaneTransform: string = '';
  resizeType = GnroResizeType;
  elementKey = uniqueId(16);
  windowConfig = input.required({
    transform: (val: GnroWindowConfig) => {
      const windowConfig = { ...defaultWindowConfig, ...val };
      this.initWindow(windowConfig);
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

  private initWindow(windowConfig: GnroWindowConfig): void {
    if (windowConfig.height) {
      this.setHeight(parseFloat(windowConfig.height));
    }
    if (windowConfig.width) {
      this.setWidth(parseFloat(windowConfig.width));
    }
    if (windowConfig.height || windowConfig.width) {
      timer(10)
        .pipe(take(1))
        .subscribe(() => this.initWindowPosition(windowConfig));
    }
  }

  dragEnded(event: CdkDragEnd): void {
    this.resetWindowPosition();
  }

  maximize(): void {
    this.windowInfo.width = this.element.clientWidth;
    this.windowInfo.height = this.element.clientHeight;
    this.windowInfo.isMaxWindowSize = true;
    this.overlayPaneTransform = this.overlayPane.style.transform;
    this.overlayPane.style.transform = `translate3d(0px, 0px, 0px)`;
    this.setWindowTransform(0, 0);
    this.setHeight(this.overlay.clientHeight);
    this.setWidth(this.overlay.clientWidth);
    //TODO issue this will cause grid reload???
    window.dispatchEvent(new Event('resize'));
  }

  restore(): void {
    this.windowInfo.isMaxWindowSize = false;
    this.overlayPane.style.transform = this.overlayPaneTransform;
    this.setWindowTransform(this.windowInfo.left, this.windowInfo.top);
    this.setHeight(this.windowInfo.height);
    this.setWidth(this.windowInfo.width);
    //TODO issue this will cause grid reload???
    window.dispatchEvent(new Event('resize'));
  }

  dblclickWindow(): void {
    if (this.windowInfo.isMaxWindowSize) {
      this.restore();
    } else {
      this.maximize();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onResizePanel(resizeInfo: GnroResizeInfo): void {
    if (resizeInfo.isResized && !this.windowInfo.isMaxWindowSize) {
      this.setWindowPosition(resizeInfo);
      this.setHeight(resizeInfo.height * resizeInfo.scaleY);
      this.setWidth(resizeInfo.width * resizeInfo.scaleX);
    }
  }

  private initWindowPosition(windowConfig: GnroWindowConfig): void {
    const topLeft = this.getWindowPosition(windowConfig.position!);
    this.setWindowInfo(topLeft.left, topLeft.top);
  }

  private getWindowPosition(position: GnroPositionType): GnroTopLeft {
    const width = this.overlay.clientWidth;
    const height = this.overlay.clientHeight;
    const w = this.element.clientWidth;
    const h = this.element.clientHeight;
    const topAdjust = h < height / 2 ? (height - h) / 4 : 70;
    const left = width < w ? 0 : (width - w) / 2;
    const top = height < h ? 0 : topAdjust;
    switch (position) {
      case GnroPositionType.TOP_MIDDLE:
        return { top: 0, left };
      case GnroPositionType.TOP_RIGHT:
        return { top: 0, left: width < w ? 0 : width - w };
      case GnroPositionType.CENTER_MIDDLE:
        const ym = height < h ? 0 : (height - h) / 2;
        return { top: ym, left };
      case GnroPositionType.BOTTOM_MIDDLE:
        return { top: height < h ? 0 : height - h, left };
      case GnroPositionType.BOTTOM_RIGHT:
        return { top: height < h ? 0 : height - h, left: width < w ? 0 : width - w };
      case GnroPositionType.DEFAULT:
      default:
        return { top, left };
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
      default:
        this.setWindowInfo(left, top);
        break;
    }
  }

  private setWindowInfo(left: number, top: number): void {
    this.setWindowTransform(left, top);
    timer(10)
      .pipe(take(1))
      .subscribe(() => {
        this.windowInfo = {
          left: left,
          top: top,
          width: this.element.clientWidth,
          height: this.element.clientHeight,
          isMaxWindowSize: this.isMaxWindowSize,
        };
        this.resetWindowPosition();
        //TODO issue this will cause grid reload???
        //window.dispatchEvent(new Event('resize'));
      });
  }

  private resetWindowPosition(): void {
    const minShow = 50;
    const { left, top } = this.windowInfo;
    const transform = this.overlayPane.style.transform;
    const values = transform.replace('translate3d(', '').split(',');
    const x0 = transform ? parseFloat(values[0]) : 0;
    const y0 = transform ? parseFloat(values[1]) : 0;
    const x = left + x0;
    const y = top + y0;
    if (y > this.overlay.clientHeight - minShow) {
      const ntop = this.overlay.clientHeight - minShow - y0;
      this.setWindowInfo(left, ntop);
    } else if (x > this.overlay.clientWidth - minShow) {
      const nleft = this.overlay.clientWidth - minShow - x0;
      this.setWindowInfo(nleft, top);
    } else if (y < 0) {
      const ntop = -y0;
      this.setWindowInfo(left, ntop);
    }
  }

  private setWindowTransform(left: number, top: number): void {
    this.overlayPane.style.left = `${left}px`;
    this.overlayPane.style.top = `${top}px`;
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

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    if (this.windowInfo.isMaxWindowSize) {
      //this.maximize();
    }
  }
}
