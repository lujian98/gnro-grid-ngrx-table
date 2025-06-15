import { ComponentRef, Inject, Injectable } from '@angular/core';
import { GnroFormFieldComponent } from '@gnro/ui/form-field';
import { GNRO_DOCUMENT } from '@gnro/ui/theme';
import { EMPTY, Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, delay, filter, map, repeat, share, switchMap, takeUntil, takeWhile } from 'rxjs/operators';

export enum GnroTrigger {
  CLICK = 'click',
  NOOP = 'noop',
  POINT = 'point',
  HOVER = 'hover',
  CONTEXTMENU = 'contextmenu',
  TOOLTIP = 'tooltip',
  FOCUS = 'focus',
}

export interface GnroTriggerStrategy {
  show$: Observable<Event>;
  hide$: Observable<Event>;
  clickToClose: boolean;

  destroy(): void;
}

export abstract class GnroTriggerStrategyBase<T> implements GnroTriggerStrategy {
  protected alive = true;
  abstract show$: Observable<Event>;
  abstract hide$: Observable<Event>;
  clickToClose: boolean = false;

  destroy() {
    this.alive = false;
  }

  constructor(
    protected document: Document,
    protected host: HTMLElement,
    protected container: () => ComponentRef<T>,
    protected formField?: GnroFormFieldComponent,
  ) {}
}

export class GnroNoopTriggerStrategy<T> extends GnroTriggerStrategyBase<T> {
  show$ = EMPTY;
  hide$ = EMPTY;
}

export class GnroPointTriggerStrategy<T> extends GnroTriggerStrategyBase<T> {
  show$ = EMPTY;
  protected click$: Observable<[boolean, Event]> = fromEvent<Event>(this.document, 'click').pipe(
    map((event: Event) => [!this.container(), event] as [boolean, Event]),
    share(),
    takeWhile(() => this.alive),
  );

  hide$ = this.click$.pipe(
    filter(([shouldShow, event]) => {
      let show = true;
      const box = this.container() && this.container().location.nativeElement.getBoundingClientRect();
      if (box) {
        const { x, y } = event as MouseEvent;
        show = box.top < y && y < box.bottom && box.left < x && x < box.right;
      }
      return this.clickToClose || (!shouldShow && !show);
    }),
    map(([, event]) => event),
    takeWhile(() => this.alive),
  );
}

export class GnroClickTriggerStrategy<T> extends GnroTriggerStrategyBase<T> {
  protected click$: Observable<[boolean, Event]> = fromEvent<Event>(this.document, 'click').pipe(
    map((event: Event) => [!this.container() && this.host.contains(event.target as Node), event] as [boolean, Event]),
    share(),
    takeWhile(() => this.alive),
  );

  show$ = this.click$.pipe(
    filter(([shouldShow]) => shouldShow),
    map(([, event]) => event),
    takeWhile(() => this.alive),
  );

  hide$ = this.click$.pipe(
    filter(
      ([shouldShow, event]) =>
        !shouldShow && !(this.container() && this.container().location.nativeElement.contains(event.target)),
    ),
    map(([, event]) => event),
    takeWhile(() => this.alive),
  );
}

export class GnroHoverTriggerStrategy<T> extends GnroTriggerStrategyBase<T> {
  show$ = fromEvent<Event>(this.host, 'mouseenter').pipe(
    filter(() => !this.container()),
    delay(100),
    takeUntil(fromEvent<Event>(this.host, 'mouseleave')),
    repeat(),
    takeWhile(() => this.alive),
  );

  hide$ = fromEvent<Event>(this.host, 'mouseleave').pipe(
    switchMap(() =>
      fromEvent<Event>(this.document, 'mousemove').pipe(
        debounceTime(100),
        takeWhile(() => !!this.container()),
        filter((event) => {
          return (
            !this.host.contains(event.target as Node) && !this.container().location.nativeElement.contains(event.target)
          );
        }),
      ),
    ),
    takeWhile(() => this.alive),
  );
}

export class GnroTooltipTriggerStrategy<T> extends GnroTriggerStrategyBase<T> {
  show$ = fromEvent<Event>(this.host, 'mouseenter').pipe(
    filter(() => !this.container()),
    delay(750),
    takeUntil(fromEvent<Event>(this.host, 'mouseleave')),
    repeat(),
    takeWhile(() => this.alive),
  );

  hide$ = fromEvent<Event>(this.host, 'mouseleave').pipe(takeWhile(() => this.alive));
}

export class GnroContextmenuTriggerStrategy<T> extends GnroTriggerStrategyBase<T> {
  protected rightClick$: Observable<[boolean, Event]> = fromEvent<Event>(this.document, 'contextmenu').pipe(
    map((event: Event) => [this.host.contains(event.target as Node), event] as [boolean, Event]),
    share(),
    takeWhile(() => this.alive),
  );

  show$ = this.rightClick$.pipe(
    filter(([shouldShow]) => shouldShow),
    map(([, event]) => {
      event.preventDefault();
      return event;
    }),
    takeWhile(() => this.alive),
  );

  protected merged$ = merge(
    fromEvent<Event>(this.document, 'click'),
    this.rightClick$.pipe(
      filter(([shouldShow, event]) => !shouldShow),
      map(([, event]) => event),
    ),
  );

  hide$ = this.merged$.pipe(
    filter(
      (event) =>
        this.clickToClose || !(this.container() && this.container().location.nativeElement.contains(event.target)),
    ),
    map((event) => event),
    takeWhile(() => this.alive),
  );
}

export class GnroFocusTriggerStrategy<T> extends GnroTriggerStrategyBase<T> {
  show$ = merge(
    fromEvent<Event>(this.host, 'focus'),
    fromEvent<Event>(this.host, 'click'),
    fromEvent<Event>(this.host, 'keydown'),
  ).pipe(takeWhile(() => this.alive));

  hide$ = fromEvent<Event>(this.document, 'click').pipe(
    filter((event) => {
      const clickTarget = event.target as HTMLElement;
      const notOrigin = clickTarget !== this.host;
      const notOverlay = !(this.container() && this.container().location.nativeElement.contains(clickTarget));
      const formField = this.formField ? this.formField.elementRef.nativeElement : null;
      const notFormfield = !formField?.contains(clickTarget);
      return notOrigin && notOverlay && notFormfield;
    }),
    map((event) => event),
    takeWhile(() => this.alive),
  );
}

@Injectable()
export class GnroTriggerStrategyBuilderService<T> {
  constructor(@Inject(GNRO_DOCUMENT) protected document: Document) {}

  build(host: HTMLElement, container: () => ComponentRef<T>, trigger: GnroTrigger, formField?: GnroFormFieldComponent) {
    switch (trigger) {
      case GnroTrigger.CLICK:
        return new GnroClickTriggerStrategy(this.document, host, container);
      case GnroTrigger.NOOP:
        return new GnroNoopTriggerStrategy(this.document, host, container);
      case GnroTrigger.POINT:
        return new GnroPointTriggerStrategy(this.document, host, container);
      case GnroTrigger.HOVER:
        return new GnroHoverTriggerStrategy(this.document, host, container, formField);
      case GnroTrigger.CONTEXTMENU:
        return new GnroContextmenuTriggerStrategy(this.document, host, container);
      case GnroTrigger.TOOLTIP:
        return new GnroTooltipTriggerStrategy(this.document, host, container, formField);
      case GnroTrigger.FOCUS:
        return new GnroFocusTriggerStrategy(this.document, host, container, formField);
      default:
        throw new Error('Unknown trigger provided.');
    }
  }
}
