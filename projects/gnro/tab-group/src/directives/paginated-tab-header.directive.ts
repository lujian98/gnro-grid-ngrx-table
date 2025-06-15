import { FocusKeyManager, FocusableOption } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ENTER, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { Platform, _bindEventWithOptions } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  ANIMATION_MODULE_TYPE,
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  afterNextRender,
  booleanAttribute,
  inject,
  numberAttribute,
} from '@angular/core';
import { EMPTY, Observable, Observer, Subject, merge, of as observableOf, timer } from 'rxjs';
import { debounceTime, filter, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';

const passiveEventListenerOptions = {
  passive: true,
};
export type ScrollDirection = 'after' | 'before';
const HEADER_SCROLL_DELAY = 650;
const HEADER_SCROLL_INTERVAL = 100;
export type GnroPaginatedTabHeaderItem = FocusableOption & { elementRef: ElementRef };

@Directive()
export abstract class GnroPaginatedTabHeaderDirective
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  protected _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected _changeDetectorRef = inject(ChangeDetectorRef);
  private _viewportRuler = inject(ViewportRuler);
  private _dir = inject(Directionality, { optional: true });
  private _ngZone = inject(NgZone);
  private _platform = inject(Platform);
  private _sharedResizeObserver = inject(SharedResizeObserver);
  private _injector = inject(Injector);
  private _renderer = inject(Renderer2);
  _animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });
  private _eventCleanups: (() => void)[];

  abstract _items: QueryList<GnroPaginatedTabHeaderItem>;
  abstract _inkBar: { hide: () => void; alignToElement: (element: HTMLElement) => void };
  abstract _tabListContainer: ElementRef<HTMLElement>;
  abstract _tabList: ElementRef<HTMLElement>;
  abstract _tabListInner: ElementRef<HTMLElement>;
  abstract _nextPaginator: ElementRef<HTMLElement>;
  abstract _previousPaginator: ElementRef<HTMLElement>;
  private _scrollDistance = 0;
  private _selectedIndexChanged = false;
  protected readonly _destroyed = new Subject<void>();

  _showPaginationControls = false;
  _disableScrollAfter = true;
  _disableScrollBefore = true;

  private _tabLabelCount!: number;
  private _scrollDistanceChanged!: boolean;
  private _keyManager!: FocusKeyManager<GnroPaginatedTabHeaderItem>;
  private _currentTextContent!: string;
  private _stopScrolling = new Subject<void>();

  @Input({ transform: booleanAttribute })
  disablePagination: boolean = false;

  @Input({ transform: numberAttribute })
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(v: number) {
    const value = isNaN(v) ? 0 : v;

    if (this._selectedIndex != value) {
      this._selectedIndexChanged = true;
      this._selectedIndex = value;

      if (this._keyManager) {
        this._keyManager.updateActiveItem(value);
      }
    }
  }
  private _selectedIndex: number = 0;

  @Output() readonly selectFocusedIndex: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly indexFocused: EventEmitter<number> = new EventEmitter<number>();

  constructor(...args: unknown[]);

  constructor() {
    this._eventCleanups = this._ngZone.runOutsideAngular(() => [
      this._renderer.listen(this._elementRef.nativeElement, 'mouseleave', () => this._stopInterval()),
    ]);
  }

  protected abstract _itemSelected(event: KeyboardEvent): void;

  ngAfterViewInit() {
    this._eventCleanups.push(
      _bindEventWithOptions(
        this._renderer,
        this._previousPaginator.nativeElement,
        'touchstart',
        () => this._handlePaginatorPress('before'),
        passiveEventListenerOptions,
      ),
      _bindEventWithOptions(
        this._renderer,
        this._nextPaginator.nativeElement,
        'touchstart',
        () => this._handlePaginatorPress('after'),
        passiveEventListenerOptions,
      ),
    );
  }

  ngAfterContentInit() {
    const dirChange = this._dir ? this._dir.change : observableOf('ltr');
    const resize = this._sharedResizeObserver
      .observe(this._elementRef.nativeElement)
      .pipe(debounceTime(32), takeUntil(this._destroyed));
    const viewportResize = this._viewportRuler.change(150).pipe(takeUntil(this._destroyed));

    const realign = () => {
      this.updatePagination();
      this._alignInkBarToSelectedTab();
    };

    this._keyManager = new FocusKeyManager<GnroPaginatedTabHeaderItem>(this._items)
      .withHorizontalOrientation(this._getLayoutDirection())
      .withHomeAndEnd()
      .withWrap()
      .skipPredicate(() => false);

    this._keyManager.updateActiveItem(this._selectedIndex);
    afterNextRender(realign, { injector: this._injector });

    merge(dirChange, viewportResize, resize, this._items.changes, this._itemsResized())
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._ngZone.run(() => {
          Promise.resolve().then(() => {
            this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), this._scrollDistance));
            realign();
          });
        });
        this._keyManager.withHorizontalOrientation(this._getLayoutDirection());
      });

    this._keyManager.change.subscribe((newFocusIndex) => {
      this.indexFocused.emit(newFocusIndex);
      this._setTabFocus(newFocusIndex);
    });
  }

  private _itemsResized(): Observable<ResizeObserverEntry[]> {
    if (typeof ResizeObserver !== 'function') {
      return EMPTY;
    }

    return this._items.changes.pipe(
      startWith(this._items),
      switchMap(
        (tabItems: QueryList<GnroPaginatedTabHeaderItem>) =>
          new Observable((observer: Observer<ResizeObserverEntry[]>) =>
            this._ngZone.runOutsideAngular(() => {
              const resizeObserver = new ResizeObserver((entries) => observer.next(entries));
              tabItems.forEach((item) => resizeObserver.observe(item.elementRef.nativeElement));
              return () => {
                resizeObserver.disconnect();
              };
            }),
          ),
      ),
      skip(1),
      filter((entries) => entries.some((e) => e.contentRect.width > 0 && e.contentRect.height > 0)),
    );
  }

  ngAfterContentChecked(): void {
    if (this._tabLabelCount != this._items.length) {
      this.updatePagination();
      this._tabLabelCount = this._items.length;
      this._changeDetectorRef.markForCheck();
    }

    if (this._selectedIndexChanged) {
      this._scrollToLabel(this._selectedIndex);
      this._checkScrollingControls();
      this._alignInkBarToSelectedTab();
      this._selectedIndexChanged = false;
      this._changeDetectorRef.markForCheck();
    }

    if (this._scrollDistanceChanged) {
      this._updateTabScrollPosition();
      this._scrollDistanceChanged = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy() {
    this._eventCleanups.forEach((cleanup) => cleanup());
    this._keyManager?.destroy();
    this._destroyed.next();
    this._destroyed.complete();
    this._stopScrolling.complete();
  }

  _handleKeydown(event: KeyboardEvent) {
    if (hasModifierKey(event)) {
      return;
    }

    switch (event.keyCode) {
      case ENTER:
      case SPACE:
        if (this.focusIndex !== this.selectedIndex) {
          const item = this._items.get(this.focusIndex);

          if (item && !item.disabled) {
            this.selectFocusedIndex.emit(this.focusIndex);
            this._itemSelected(event);
          }
        }
        break;
      default:
        this._keyManager.onKeydown(event);
    }
  }

  _onContentChanges() {
    const textContent = this._elementRef.nativeElement.textContent;
    if (textContent !== this._currentTextContent) {
      this._currentTextContent = textContent || '';

      this._ngZone.run(() => {
        this.updatePagination();
        this._alignInkBarToSelectedTab();
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  updatePagination() {
    this._checkPaginationEnabled();
    this._checkScrollingControls();
    this._updateTabScrollPosition();
  }

  get focusIndex(): number {
    return this._keyManager ? this._keyManager.activeItemIndex! : 0;
  }

  set focusIndex(value: number) {
    if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
      return;
    }

    this._keyManager.setActiveItem(value);
  }

  _isValidIndex(index: number): boolean {
    return this._items ? !!this._items.toArray()[index] : true;
  }

  _setTabFocus(tabIndex: number) {
    if (this._showPaginationControls) {
      this._scrollToLabel(tabIndex);
    }

    if (this._items && this._items.length) {
      this._items.toArray()[tabIndex].focus();

      const containerEl = this._tabListContainer.nativeElement;
      const dir = this._getLayoutDirection();

      if (dir == 'ltr') {
        containerEl.scrollLeft = 0;
      } else {
        containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
      }
    }
  }

  _getLayoutDirection(): Direction {
    return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
  }

  _updateTabScrollPosition() {
    if (this.disablePagination) {
      return;
    }

    const scrollDistance = this.scrollDistance;
    const translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
    this._tabList.nativeElement.style.transform = `translateX(${Math.round(translateX)}px)`;
    if (this._platform.TRIDENT || this._platform.EDGE) {
      this._tabListContainer.nativeElement.scrollLeft = 0;
    }
  }

  get scrollDistance(): number {
    return this._scrollDistance;
  }
  set scrollDistance(value: number) {
    this._scrollTo(value);
  }

  _scrollHeader(direction: ScrollDirection) {
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    const scrollAmount = ((direction == 'before' ? -1 : 1) * viewLength) / 3;

    return this._scrollTo(this._scrollDistance + scrollAmount);
  }

  _handlePaginatorClick(direction: ScrollDirection) {
    this._stopInterval();
    this._scrollHeader(direction);
  }

  _scrollToLabel(labelIndex: number) {
    if (this.disablePagination) {
      return;
    }

    const selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;

    if (!selectedLabel) {
      return;
    }

    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;

    let labelBeforePos: number, labelAfterPos: number;
    if (this._getLayoutDirection() == 'ltr') {
      labelBeforePos = offsetLeft;
      labelAfterPos = labelBeforePos + offsetWidth;
    } else {
      labelAfterPos = this._tabListInner.nativeElement.offsetWidth - offsetLeft;
      labelBeforePos = labelAfterPos - offsetWidth;
    }

    const beforeVisiblePos = this.scrollDistance;
    const afterVisiblePos = this.scrollDistance + viewLength;

    if (labelBeforePos < beforeVisiblePos) {
      this.scrollDistance -= beforeVisiblePos - labelBeforePos;
    } else if (labelAfterPos > afterVisiblePos) {
      this.scrollDistance += Math.min(labelAfterPos - afterVisiblePos, labelBeforePos - beforeVisiblePos);
    }
  }

  _checkPaginationEnabled() {
    if (this.disablePagination) {
      this._showPaginationControls = false;
    } else {
      const scrollWidth = this._tabListInner.nativeElement.scrollWidth;
      const containerWidth = this._elementRef.nativeElement.offsetWidth;
      const isEnabled = scrollWidth - containerWidth >= 5;

      if (!isEnabled) {
        this.scrollDistance = 0;
      }

      if (isEnabled !== this._showPaginationControls) {
        this._showPaginationControls = isEnabled;
        this._changeDetectorRef.markForCheck();
      }
    }
  }

  _checkScrollingControls() {
    if (this.disablePagination) {
      this._disableScrollAfter = this._disableScrollBefore = true;
    } else {
      this._disableScrollBefore = this.scrollDistance == 0;
      this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
      this._changeDetectorRef.markForCheck();
    }
  }

  _getMaxScrollDistance(): number {
    const lengthOfTabList = this._tabListInner.nativeElement.scrollWidth;
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    return lengthOfTabList - viewLength || 0;
  }

  _alignInkBarToSelectedTab(): void {
    const selectedItem = this._items && this._items.length ? this._items.toArray()[this.selectedIndex] : null;
    const selectedLabelWrapper = selectedItem ? selectedItem.elementRef.nativeElement : null;

    if (selectedLabelWrapper) {
      this._inkBar.alignToElement(selectedLabelWrapper);
    } else {
      this._inkBar.hide();
    }
  }

  _stopInterval() {
    this._stopScrolling.next();
  }

  _handlePaginatorPress(direction: ScrollDirection, mouseEvent?: MouseEvent) {
    if (mouseEvent && mouseEvent.button != null && mouseEvent.button !== 0) {
      return;
    }

    this._stopInterval();

    timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
      .pipe(takeUntil(merge(this._stopScrolling, this._destroyed)))
      .subscribe(() => {
        const { maxScrollDistance, distance } = this._scrollHeader(direction);

        if (distance === 0 || distance >= maxScrollDistance) {
          this._stopInterval();
        }
      });
  }

  private _scrollTo(position: number) {
    if (this.disablePagination) {
      return { maxScrollDistance: 0, distance: 0 };
    }

    const maxScrollDistance = this._getMaxScrollDistance();
    this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));

    this._scrollDistanceChanged = true;
    this._checkScrollingControls();

    return { maxScrollDistance, distance: this._scrollDistance };
  }
}
