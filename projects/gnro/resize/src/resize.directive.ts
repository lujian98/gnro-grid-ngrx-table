import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output, Renderer2 } from '@angular/core';
import { GNRO_DOCUMENT } from '@gnro/ui/theme';
import { GnroResizeInfo, GnroResizeType } from './model';

@Directive({
  selector: '[gnroResize]',
  exportAs: 'gnroResize',
})
export class GnroResizeDirective implements OnInit, OnDestroy {
  private readonly document = inject(GNRO_DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);
  private resizableMousedown!: () => void;
  private resizableMousemove!: () => void;
  private resizableMouseup!: () => void;
  private isResizing = false;
  private resizeInfo!: GnroResizeInfo;
  direction = input.required<GnroResizeType>();
  elementKey = input.required<string>();
  gnroResizeEvent = output<GnroResizeInfo>();

  ngOnInit(): void {
    this.resizableMousedown = this.renderer.listen(this.document, 'mousedown', (event: MouseEvent) => {
      const el = this.document.elementFromPoint(event.x, event.y)!;
      const direction = el.getAttribute('ng-reflect-direction');
      const elementKey = el.getAttribute('ng-reflect-element-key');
      if (!this.isResizing && elementKey === this.elementKey() && direction === this.direction()) {
        this.isResizing = true;
        this.setElementResize(event);
      }
    });
  }

  private getResizeEl(): HTMLDivElement {
    if (this.direction() === GnroResizeType.LEFT_RIGHT || this.direction() === GnroResizeType.TOP_BOTTOM) {
      return this.elementRef.nativeElement.previousElementSibling;
    } else if (this.direction() === GnroResizeType.RIGHT_LEFT || this.direction() === GnroResizeType.BOTTOM_TOP) {
      return this.elementRef.nativeElement.nextElementSibling;
    }
    return this.elementRef.nativeElement.parentNode;
  }

  private setElementResize(e: MouseEvent): void {
    const el = this.getResizeEl();
    const box = el.getBoundingClientRect();
    this.resizeInfo = {
      direction: this.direction(),
      element: el,
      isResized: false,
      origin: null,
      width: box.width,
      height: box.height,
      dx: 0,
      dy: 0,
      scaleX: 1,
      scaleY: 1,
      signX: Math.abs(box.right - e.pageX) < 10 ? 1 : -1,
      signY: Math.abs(box.bottom - e.pageY) < 10 ? 1 : -1,
    };
    this.resizableMousemove = this.renderer.listen(this.document, 'mousemove', (event: MouseEvent) => {
      if (this.isResizing && e && box) {
        this.resizeInfo.dx = event.pageX - e.pageX;
        this.resizeInfo.dy = event.pageY - e.pageY;
        this.resizeInfo.scaleX = (box.width + this.resizeInfo.signX * this.resizeInfo.dx) / box.width;
        this.resizeInfo.scaleY = (box.height + this.resizeInfo.signY * this.resizeInfo.dy) / box.height;
        this.elementTransform();
        if (this.resizeInfo.origin) {
          this.gnroResizeEvent.emit(this.resizeInfo);
          if (this.direction() === GnroResizeType.LEFT_RIGHT || this.direction() === GnroResizeType.RIGHT_LEFT) {
            const width = this.resizeInfo.width * this.resizeInfo.scaleX;
            el.style.flex = `0 0 ${width}px`;
          } else if (this.direction() === GnroResizeType.TOP_BOTTOM || this.direction() === GnroResizeType.BOTTOM_TOP) {
            const height = this.resizeInfo.height * this.resizeInfo.scaleY;
            el.style.flex = `0 0 ${height}px`;
          } else {
            el.style.transformOrigin = this.resizeInfo.origin;
            el.style.transform = `scale(${this.resizeInfo.scaleX}, ${this.resizeInfo.scaleY})`;
          }
        }
      }
    });
    this.resizableMouseup = this.renderer.listen(this.document, 'mouseup', (event: MouseEvent) => {
      if (this.isResizing && this.resizeInfo.origin) {
        if (this.direction() === GnroResizeType.TOP_BOTTOM || this.direction() === GnroResizeType.BOTTOM_TOP) {
          const height = this.resizeInfo.height * this.resizeInfo.scaleY;
          const parent = this.elementRef.nativeElement.parentElement;
          const dh = parent.scrollHeight - parent.clientHeight;
          el.style.flex = `0 0 ${height - dh}px`;
        } else if (this.direction() === GnroResizeType.LEFT_RIGHT) {
          const parent = this.elementRef.nativeElement.parentElement;
          const dw = parent.scrollWidth - parent.clientWidth;
          const width = this.resizeInfo.width * this.resizeInfo.scaleX;
          el.style.flex = `0 0 ${width - dw}px`;
        }
        el.style.transformOrigin = '';
        el.style.transform = '';
        this.resizeInfo.isResized = true;
        this.gnroResizeEvent.emit(this.resizeInfo);
        if (
          this.direction() === GnroResizeType.LEFT_RIGHT ||
          this.direction() === GnroResizeType.RIGHT_LEFT || // WARNING IE not supported
          this.direction() === GnroResizeType.TOP_BOTTOM ||
          this.direction() === GnroResizeType.BOTTOM_TOP
        ) {
          window.dispatchEvent(new Event('resize'));
        }
      }
      this.isResizing = false;
      event.preventDefault();
      event.stopPropagation();
      this.resizableMousemove();
      this.resizableMouseup();
    });
  }

  private elementTransform(): void {
    this.resizeInfo.origin = null;
    switch (this.direction()) {
      case GnroResizeType.TOP:
      case GnroResizeType.TOP_BOTTOM:
        this.resizeInfo.origin = 'bottom';
        this.resizeInfo.scaleX = 1;
        break;
      case GnroResizeType.RIGHT:
      case GnroResizeType.LEFT_RIGHT:
        this.resizeInfo.origin = 'left';
        this.resizeInfo.scaleY = 1;
        break;
      case GnroResizeType.BOTTOM:
      case GnroResizeType.BOTTOM_TOP:
        this.resizeInfo.origin = 'top';
        this.resizeInfo.scaleX = 1;
        break;
      case GnroResizeType.LEFT:
      case GnroResizeType.RIGHT_LEFT:
        this.resizeInfo.origin = 'right';
        this.resizeInfo.scaleY = 1;
        break;
      case GnroResizeType.TOP_LEFT:
        this.resizeInfo.origin = 'bottom right';
        break;
      case GnroResizeType.TOP_RIGHT:
        this.resizeInfo.origin = 'bottom left';
        break;
      case GnroResizeType.BOTTOM_RIGHT:
        this.resizeInfo.origin = 'top left';
        break;
      case GnroResizeType.BOTTOM_LEFT:
        this.resizeInfo.origin = 'top right';
        break;
    }
  }

  ngOnDestroy(): void {
    this.resizableMousedown();
  }
}
