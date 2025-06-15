import { Direction, Directionality } from '@angular/cdk/bidi';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Directive({ selector: '[gnroTabBodyHost]' })
export class GnroTabBodyPortalDirective extends CdkPortalOutlet implements OnInit, OnDestroy {
  private _host = inject(GnroTabBodyComponent);
  private _centeringSub = Subscription.EMPTY;
  private _leavingSub = Subscription.EMPTY;

  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._centeringSub = this._host._beforeCentering
      .pipe(startWith(this._host._isCenterPosition()))
      .subscribe((isCentering: boolean) => {
        if (this._host._content && isCentering && !this.hasAttached()) {
          this.attach(this._host._content);
        }
      });

    this._leavingSub = this._host._afterLeavingCenter.subscribe(() => {
      if (!this._host.preserveContent) {
        this.detach();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._centeringSub.unsubscribe();
    this._leavingSub.unsubscribe();
  }
}

/**
 * These position states are used internally as animation states for the tab body. Setting the
 * position state to left, right, or center will transition the tab body from its current
 * position to its respective state. If there is not current position (void, in the case of a new
 * tab body), then there will be no transition animation to its state.
 *
 * In the case of a new tab body that should immediately be centered with an animating transition,
 * then left-origin-center or right-origin-center can be used, which will use left or right as its
 * pseudo-prior state.
 *
 * @deprecated Will stop being exported.
 * @breaking-change 21.0.0
 */
export type GnroTabBodyPositionState = 'left' | 'center' | 'right';

/**
 * The origin state is an internally used state that is set on a new tab body indicating if it
 * began to the left or right of the prior selected index. For example, if the selected index was
 * set to 1, and a new tab is created and selected at index 2, then the tab body would have an
 * origin of right because its index was greater than the prior selected index.
 *
 * @deprecated No longer being used. Will be removed.
 * @breaking-change 21.0.0
 */
export type GnroTabBodyOriginState = 'left' | 'right';

@Component({
  selector: 'gnro-tab-body',
  templateUrl: './tab-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gnro-mdc-tab-body',
    '[attr.inert]': '_position === "center" ? null : ""',
  },
  imports: [GnroTabBodyPortalDirective, CdkScrollable],
})
export class GnroTabBodyComponent implements OnInit, OnDestroy {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _dir = inject(Directionality, { optional: true });
  private _ngZone = inject(NgZone);
  private _injector = inject(Injector);
  private _renderer = inject(Renderer2);
  private _animationsModule = inject(ANIMATION_MODULE_TYPE, { optional: true });
  private _eventCleanups?: (() => void)[];
  private _initialized!: boolean;
  private _fallbackTimer!: ReturnType<typeof setTimeout>;
  private _positionIndex!: number;
  private _dirChangeSubscription = Subscription.EMPTY;
  _position!: GnroTabBodyPositionState;
  protected _previousPosition: GnroTabBodyPositionState | undefined;

  @Output() readonly _onCentering: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly _beforeCentering: EventEmitter<boolean> = new EventEmitter<boolean>();
  readonly _afterLeavingCenter: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly _onCentered: EventEmitter<void> = new EventEmitter<void>(true);
  @ViewChild(GnroTabBodyPortalDirective) _portalHost!: GnroTabBodyPortalDirective;
  @ViewChild('content') _contentElement: ElementRef<HTMLElement> | undefined;
  @Input('content') _content!: TemplatePortal;
  @Input() animationDuration: string = '500ms';
  @Input() preserveContent: boolean = false;
  @Input()
  set position(position: number) {
    this._positionIndex = position;
    this._computePositionAnimationState();
  }

  constructor(...args: unknown[]);

  constructor() {
    if (this._dir) {
      const changeDetectorRef = inject(ChangeDetectorRef);
      this._dirChangeSubscription = this._dir.change.subscribe((dir: Direction) => {
        this._computePositionAnimationState(dir);
        changeDetectorRef.markForCheck();
      });
    }
  }

  ngOnInit() {
    this._bindTransitionEvents();

    if (this._position === 'center') {
      this._setActiveClass(true);
      afterNextRender(() => this._onCentering.emit(this._elementRef.nativeElement.clientHeight), {
        injector: this._injector,
      });
    }

    this._initialized = true;
  }

  ngOnDestroy() {
    clearTimeout(this._fallbackTimer);
    this._eventCleanups?.forEach((cleanup) => cleanup());
    this._dirChangeSubscription.unsubscribe();
  }

  private _bindTransitionEvents() {
    this._ngZone.runOutsideAngular(() => {
      const element = this._elementRef.nativeElement;
      const transitionDone = (event: TransitionEvent) => {
        if (event.target === this._contentElement?.nativeElement) {
          this._elementRef.nativeElement.classList.remove('gnro-tab-body-animating');
          if (event.type === 'transitionend') {
            this._transitionDone();
          }
        }
      };

      this._eventCleanups = [
        this._renderer.listen(element, 'transitionstart', (event: TransitionEvent) => {
          if (event.target === this._contentElement?.nativeElement) {
            this._elementRef.nativeElement.classList.add('gnro-tab-body-animating');
            this._transitionStarted();
          }
        }),
        this._renderer.listen(element, 'transitionend', transitionDone),
        this._renderer.listen(element, 'transitioncancel', transitionDone),
      ];
    });
  }

  private _transitionStarted() {
    clearTimeout(this._fallbackTimer);
    const isCentering = this._position === 'center';
    this._beforeCentering.emit(isCentering);
    if (isCentering) {
      this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
    }
  }

  private _transitionDone() {
    if (this._position === 'center') {
      this._onCentered.emit();
    } else if (this._previousPosition === 'center') {
      this._afterLeavingCenter.emit();
    }
  }

  _setActiveClass(isActive: boolean) {
    this._elementRef.nativeElement.classList.toggle('gnro-mdc-tab-body-active', isActive);
  }

  _getLayoutDirection(): Direction {
    return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
  }

  _isCenterPosition(): boolean {
    return this._positionIndex === 0;
  }

  private _computePositionAnimationState(dir: Direction = this._getLayoutDirection()) {
    this._previousPosition = this._position;

    if (this._positionIndex < 0) {
      this._position = dir == 'ltr' ? 'left' : 'right';
    } else if (this._positionIndex > 0) {
      this._position = dir == 'ltr' ? 'right' : 'left';
    } else {
      this._position = 'center';
    }

    if (this._animationsDisabled()) {
      this._simulateTransitionEvents();
    } else if (this._initialized && (this._position === 'center' || this._previousPosition === 'center')) {
      clearTimeout(this._fallbackTimer);
      this._fallbackTimer = this._ngZone.runOutsideAngular(() =>
        setTimeout(() => this._simulateTransitionEvents(), 100),
      );
    }
  }

  private _simulateTransitionEvents() {
    this._transitionStarted();
    afterNextRender(() => this._transitionDone(), { injector: this._injector });
  }

  private _animationsDisabled() {
    return (
      this._animationsModule === 'NoopAnimations' || this.animationDuration === '0ms' || this.animationDuration === '0s'
    );
  }
}
