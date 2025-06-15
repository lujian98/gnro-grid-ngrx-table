import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { uniqueId } from '@gnro/ui/core';
import { GnroResizeDirective, GnroResizeInfo, GnroResizeType } from '@gnro/ui/resize';

@Component({
  selector: 'gnro-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.gnro-main-viewport-layout]': 'layout() === "viewport"',
    '[class.gnro-normal-layout]': 'layout() !== "viewport"',
  },
  imports: [GnroResizeDirective],
})
export class GnroLayoutComponent {
  private readonly elementRef = inject(ElementRef);
  resizeType = GnroResizeType;
  elementKey = uniqueId(16);
  resizeable = input<boolean>(false);
  layout = input<string>(''); // viewport
  height = input('', {
    transform: (height: string) => {
      if (height) {
        this.setHeight(height);
      }
      return height;
    },
  });
  width = input('', {
    transform: (width: string) => {
      if (width) {
        this.setWidth(width);
      }
      return width;
    },
  });

  get viewportLayout(): boolean {
    return this.layout() === 'viewport';
  }

  get normalLayout(): boolean {
    return this.layout() !== 'viewport';
  }

  onResizePanel(resizeInfo: GnroResizeInfo): void {
    if (resizeInfo.isResized) {
      const height = resizeInfo.height * resizeInfo.scaleY;
      const width = resizeInfo.width * resizeInfo.scaleX;
      this.setHeight(`${height}px`);
      this.setWidth(`${width}px`);
    }
  }

  private setHeight(height: string): void {
    const el = this.elementRef.nativeElement;
    if (el) {
      el.style.height = height;
    }
  }

  private setWidth(width: string): void {
    const el = this.elementRef.nativeElement;
    if (el) {
      el.style.width = width;
    }
  }
}
