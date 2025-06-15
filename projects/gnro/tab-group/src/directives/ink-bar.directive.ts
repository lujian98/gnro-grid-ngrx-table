import {
  Directive,
  ElementRef,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  booleanAttribute,
  inject,
} from '@angular/core';

export interface GnroInkBarItem extends OnInit, OnDestroy {
  elementRef: ElementRef<HTMLElement>;
  activateInkBar(previousIndicatorClientRect?: DOMRect): void;
  deactivateInkBar(): void;
  fitInkBarToContent: boolean;
}

const ACTIVE_CLASS = 'mdc-tab-indicator--active';
const NO_TRANSITION_CLASS = 'mdc-tab-indicator--no-transition';

export class GnroInkBar {
  private _currentItem: GnroInkBarItem | undefined;

  constructor(private _items: QueryList<GnroInkBarItem>) {}

  hide() {
    this._items.forEach((item) => item.deactivateInkBar());
    this._currentItem = undefined;
  }

  alignToElement(element: HTMLElement) {
    const correspondingItem = this._items.find((item) => item.elementRef.nativeElement === element);
    const currentItem = this._currentItem;

    if (correspondingItem === currentItem) {
      return;
    }

    currentItem?.deactivateInkBar();

    if (correspondingItem) {
      const domRect = currentItem?.elementRef.nativeElement.getBoundingClientRect?.();
      correspondingItem.activateInkBar(domRect);
      this._currentItem = correspondingItem;
    }
  }
}

@Directive()
export abstract class GnroInkBarItemDirective implements OnInit, OnDestroy {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _inkBarElement!: HTMLElement | null;
  private _inkBarContentElement!: HTMLElement | null;
  private _fitToContent = false;

  @Input({ transform: booleanAttribute })
  get fitInkBarToContent(): boolean {
    return this._fitToContent;
  }
  set fitInkBarToContent(newValue: boolean) {
    if (this._fitToContent !== newValue) {
      this._fitToContent = newValue;

      if (this._inkBarElement) {
        this._appendInkBarElement();
      }
    }
  }

  activateInkBar(previousIndicatorClientRect?: DOMRect) {
    const element = this._elementRef.nativeElement;
    if (!previousIndicatorClientRect || !element.getBoundingClientRect || !this._inkBarContentElement) {
      element.classList.add(ACTIVE_CLASS);
      return;
    }

    const currentClientRect = element.getBoundingClientRect();
    const widthDelta = previousIndicatorClientRect.width / currentClientRect.width;
    const xPosition = previousIndicatorClientRect.left - currentClientRect.left;
    element.classList.add(NO_TRANSITION_CLASS);
    this._inkBarContentElement.style.setProperty('transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);

    element.getBoundingClientRect();
    element.classList.remove(NO_TRANSITION_CLASS);
    element.classList.add(ACTIVE_CLASS);
    this._inkBarContentElement.style.setProperty('transform', '');
  }

  deactivateInkBar() {
    this._elementRef.nativeElement.classList.remove(ACTIVE_CLASS);
  }

  ngOnInit() {
    this._createInkBarElement();
  }

  ngOnDestroy() {
    this._inkBarElement?.remove();
    this._inkBarElement = this._inkBarContentElement = null!;
  }

  private _createInkBarElement() {
    const documentNode = this._elementRef.nativeElement.ownerDocument || document;
    const inkBarElement = (this._inkBarElement = documentNode.createElement('span'));
    const inkBarContentElement = (this._inkBarContentElement = documentNode.createElement('span'));

    inkBarElement.className = 'mdc-tab-indicator';
    inkBarContentElement.className = 'mdc-tab-indicator__content mdc-tab-indicator__content--underline';

    inkBarElement.appendChild(this._inkBarContentElement);
    this._appendInkBarElement();
  }

  private _appendInkBarElement() {
    // @ts-ignore
    if (!this._inkBarElement && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('Ink bar element has not been created and cannot be appended');
    }

    const parentElement = this._fitToContent
      ? this._elementRef.nativeElement.querySelector('.mdc-tab__content')
      : this._elementRef.nativeElement;

    // @ts-ignore
    if (!parentElement && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('Missing element to host the ink bar');
    }

    parentElement!.appendChild(this._inkBarElement!);
  }
}

export interface _GnroInkBarPositioner {
  (element: HTMLElement): { left: string; width: string };
}

export function _GNRO_INK_BAR_POSITIONER_FACTORY(): _GnroInkBarPositioner {
  const method = (element: HTMLElement) => ({
    left: element ? (element.offsetLeft || 0) + 'px' : '0',
    width: element ? (element.offsetWidth || 0) + 'px' : '0',
  });

  return method;
}

export const _GNRO_INK_BAR_POSITIONER = new InjectionToken<_GnroInkBarPositioner>('GnroInkBarPositioner', {
  providedIn: 'root',
  factory: _GNRO_INK_BAR_POSITIONER_FACTORY,
});
