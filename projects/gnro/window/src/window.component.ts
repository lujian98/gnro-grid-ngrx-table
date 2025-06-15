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
    this.setWidth(parseFloat(windowConfig.width));

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
    this.setWindowTop(top);
    this.setWindowLeft(left);
    this.setWindowInfo();
  }

  dragEnded(event: CdkDragEnd): void {
    const element = this.elementRef.nativeElement;
    const childEl = element.firstChild;
    var style = window.getComputedStyle(childEl);
    const transformValue = style.getPropertyValue('transform');
    const matrix = transformValue
      .match(/matrix\((.*)\)/)![1]
      .split(',')
      .map(Number);
    const translateX = matrix[4];
    const translateY = matrix[5];
    const top = this.getTop(translateY);
    const left = this.getLeft(translateX);

    this.setWindowTop(top);
    this.setWindowLeft(left);
    childEl.style.transform = 'none';
  }

  private getTop(translateY: number): number {
    const element = this.elementRef.nativeElement;
    const top = parseFloat(element.style.top) + translateY;
    if (top < 0) {
      return 0;
    } else if (top > this.overlay.clientHeight) {
      return top - 20;
    }
    return top;
  }

  private getLeft(translateX: number): number {
    const element = this.elementRef.nativeElement;
    const left = parseFloat(element.style.left) + translateX;
    if (left < 0) {
      return 0;
    } else if (left > this.overlay.clientWidth) {
      return left - 20;
    }
    return left;
  }

  maximize(): void {
    this.setWindowInfo();
    this.setWindowTop(0);
    this.setWindowLeft(0);
    this.setHeight(this.overlay.clientHeight);
    this.setWidth(this.overlay.clientWidth);
  }

  restore(): void {
    this.setWindowTop(this.windowInfo.top);
    this.setWindowLeft(this.windowInfo.left);
    this.setHeight(this.windowInfo.height);
    this.setWidth(this.windowInfo.width);
  }

  private setWindowInfo(): void {
    this.windowInfo = {
      top: parseFloat(this.element.style.top),
      left: parseFloat(this.element.style.left),
      width: this.element.clientWidth,
      height: this.element.clientHeight,
    };
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
    const top = parseFloat(this.element.style.top);
    const left = parseFloat(this.element.style.left);
    switch (resizeInfo.direction) {
      case GnroResizeType.TOP:
      case GnroResizeType.TOP_RIGHT:
        this.setWindowTop(top + resizeInfo.dy);
        break;
      case GnroResizeType.LEFT:
      case GnroResizeType.BOTTOM_LEFT:
        this.setWindowLeft(left + resizeInfo.dx);
        break;
      case GnroResizeType.TOP_LEFT:
        this.setWindowTop(top + resizeInfo.dy);
        this.setWindowLeft(left + resizeInfo.dx);
        break;
    }
  }

  private setWindowTop(top: number): void {
    this.element.style.top = `${top}px`;
  }

  private setWindowLeft(left: number): void {
    this.element.style.left = `${left}px`;
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
