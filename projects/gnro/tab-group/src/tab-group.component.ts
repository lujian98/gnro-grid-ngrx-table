import { _IdGenerator, CdkMonitorFocus, FocusOrigin } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ANIMATION_MODULE_TYPE,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  numberAttribute,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { GnroTabBodyComponent } from './components/tab-body/tab-body.component';
import { GnroTabHeaderComponent } from './components/tab-header/tab-header.component';
import { GNRO_TAB_GROUP, GnroTabComponent } from './components/tab/tab.component';
import { GnroTabLabelWrapperDirective } from './directives/tab-label-wrapper.directive';
import { GNRO_TAB_GROUP_CONFIG, GnroTabGroupConfig } from './models/tab-group.model';

export interface GnroTabGroupBaseHeader {
  _alignInkBarToSelectedTab(): void;
  updatePagination(): void;
  focusIndex: number;
}

export type GnroTabHeaderPosition = 'above' | 'below';

@Component({
  selector: 'gnro-tab-group',
  exportAs: 'gnroTabGroup',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: GNRO_TAB_GROUP,
      useExisting: GnroTabGroupComponent,
    },
  ],
  host: {
    class: 'gnro-mdc-tab-group',
    '[class]': '"gnro-" + (color || "primary")',
    '[class.gnro-mdc-tab-group-dynamic-height]': 'dynamicHeight',
    '[class.gnro-mdc-tab-group-inverted-header]': 'headerPosition === "below"',
    '[class.gnro-mdc-tab-group-stretch-tabs]': 'stretchTabs',
    '[attr.gnro-align-tabs]': 'alignTabs',
    '[style.--gnro-tab-animation-duration]': 'animationDuration',
  },
  imports: [
    GnroTabHeaderComponent,
    GnroTabLabelWrapperDirective,
    CdkMonitorFocus,
    CdkPortalOutlet,
    GnroTabBodyComponent,
  ],
})
export class GnroTabGroupComponent implements AfterViewInit, AfterContentInit, AfterContentChecked, OnDestroy {
  readonly _elementRef = inject(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _ngZone = inject(NgZone);
  private _tabsSubscription = Subscription.EMPTY;
  private _tabLabelSubscription = Subscription.EMPTY;
  private _tabBodySubscription = Subscription.EMPTY;

  _animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });

  @ContentChildren(GnroTabComponent, { descendants: true }) _allTabs!: QueryList<GnroTabComponent>;
  @ViewChildren(GnroTabBodyComponent) _tabBodies: QueryList<GnroTabBodyComponent> | undefined;
  @ViewChild('tabBodyWrapper') _tabBodyWrapper!: ElementRef;
  @ViewChild('tabHeader') _tabHeader!: GnroTabHeaderComponent;

  _tabs: QueryList<GnroTabComponent> = new QueryList<GnroTabComponent>();
  private _indexToSelect: number | null = 0;
  private _lastFocusedTabIndex: number | null = null;
  private _tabBodyWrapperHeight: number = 0;

  @Input({ transform: booleanAttribute })
  get fitInkBarToContent(): boolean {
    return this._fitInkBarToContent;
  }
  set fitInkBarToContent(value: boolean) {
    this._fitInkBarToContent = value;
    this._changeDetectorRef.markForCheck();
  }
  private _fitInkBarToContent = false;

  @Input({ alias: 'gnro-stretch-tabs', transform: booleanAttribute })
  stretchTabs: boolean = true;

  @Input({ alias: 'gnro-align-tabs' })
  alignTabs: string | null = null;

  @Input({ transform: booleanAttribute })
  dynamicHeight: boolean = false;

  @Input({ transform: numberAttribute })
  get selectedIndex(): number | null {
    return this._selectedIndex;
  }
  set selectedIndex(value: number) {
    this._indexToSelect = isNaN(value) ? null : value;
  }
  private _selectedIndex: number | null = null;

  @Input() headerPosition: GnroTabHeaderPosition = 'above';

  @Input()
  get animationDuration(): string {
    return this._animationDuration;
  }
  set animationDuration(value: string | number) {
    const stringValue = value + '';
    this._animationDuration = /^\d+$/.test(stringValue) ? value + 'ms' : stringValue;
  }
  private _animationDuration!: string;

  @Input({ transform: numberAttribute })
  get contentTabIndex(): number | null {
    return this._contentTabIndex;
  }
  set contentTabIndex(value: number) {
    this._contentTabIndex = isNaN(value) ? null : value;
  }
  private _contentTabIndex!: number | null;

  @Input({ transform: booleanAttribute })
  disablePagination: boolean = false;
  @Input({ transform: booleanAttribute })
  preserveContent: boolean = false;
  @Input('aria-label') ariaLabel!: string;
  @Input('aria-labelledby') ariaLabelledby!: string;
  @Output() readonly selectedIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly focusChange: EventEmitter<GnroTabChangeEvent> = new EventEmitter<GnroTabChangeEvent>();
  @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly selectedTabChange: EventEmitter<GnroTabChangeEvent> = new EventEmitter<GnroTabChangeEvent>(true);

  private _groupId: string;
  protected _isServer: boolean = !inject(Platform).isBrowser;
  constructor(...args: unknown[]);

  constructor() {
    const defaultConfig = inject<GnroTabGroupConfig>(GNRO_TAB_GROUP_CONFIG, { optional: true });

    this._groupId = inject(_IdGenerator).getId('gnro-tab-group-');
    this.animationDuration =
      defaultConfig && defaultConfig.animationDuration ? defaultConfig.animationDuration : '500ms';
    this.disablePagination =
      defaultConfig && defaultConfig.disablePagination != null ? defaultConfig.disablePagination : false;
    this.dynamicHeight = defaultConfig && defaultConfig.dynamicHeight != null ? defaultConfig.dynamicHeight : false;
    if (defaultConfig?.contentTabIndex != null) {
      this.contentTabIndex = defaultConfig.contentTabIndex;
    }
    this.preserveContent = !!defaultConfig?.preserveContent;
    this.fitInkBarToContent =
      defaultConfig && defaultConfig.fitInkBarToContent != null ? defaultConfig.fitInkBarToContent : false;
    this.stretchTabs = defaultConfig && defaultConfig.stretchTabs != null ? defaultConfig.stretchTabs : true;
    this.alignTabs = defaultConfig && defaultConfig.alignTabs != null ? defaultConfig.alignTabs : null;
  }

  ngAfterContentChecked() {
    const indexToSelect = (this._indexToSelect = this._clampTabIndex(this._indexToSelect));
    if (this._selectedIndex != indexToSelect) {
      const isFirstRun = this._selectedIndex == null;

      if (!isFirstRun) {
        this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
        const wrapper = this._tabBodyWrapper.nativeElement;
        wrapper.style.minHeight = wrapper.clientHeight + 'px';
      }

      Promise.resolve().then(() => {
        this._tabs.forEach((tab, index) => (tab.isActive = index === indexToSelect));

        if (!isFirstRun) {
          this.selectedIndexChange.emit(indexToSelect);
          this._tabBodyWrapper.nativeElement.style.minHeight = '';
        }
      });
    }

    this._tabs.forEach((tab: GnroTabComponent, index: number) => {
      tab.position = index - indexToSelect;
      if (this._selectedIndex != null && tab.position == 0 && !tab.origin) {
        tab.origin = indexToSelect - this._selectedIndex;
      }
    });

    if (this._selectedIndex !== indexToSelect) {
      this._selectedIndex = indexToSelect;
      this._lastFocusedTabIndex = null;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngAfterContentInit() {
    this._subscribeToAllTabChanges();
    this._subscribeToTabLabels();

    this._tabsSubscription = this._tabs.changes.subscribe(() => {
      const indexToSelect = this._clampTabIndex(this._indexToSelect);
      if (indexToSelect === this._selectedIndex) {
        const tabs = this._tabs.toArray();
        let selectedTab: GnroTabComponent | undefined;

        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].isActive) {
            this._indexToSelect = this._selectedIndex = i;
            this._lastFocusedTabIndex = null;
            selectedTab = tabs[i];
            break;
          }
        }

        if (!selectedTab && tabs[indexToSelect]) {
          Promise.resolve().then(() => {
            tabs[indexToSelect].isActive = true;
            this.selectedTabChange.emit(this._createChangeEvent(indexToSelect));
          });
        }
      }

      this._changeDetectorRef.markForCheck();
    });
  }

  ngAfterViewInit() {
    this._tabBodySubscription = this._tabBodies!.changes.subscribe(() => this._bodyCentered(true));
  }

  private _subscribeToAllTabChanges() {
    this._allTabs.changes.pipe(startWith(this._allTabs)).subscribe((tabs: QueryList<GnroTabComponent>) => {
      this._tabs.reset(
        tabs.filter((tab) => {
          return tab._closestTabGroup === this || !tab._closestTabGroup;
        }),
      );
      this._tabs.notifyOnChanges();
    });
  }

  ngOnDestroy() {
    this._tabs.destroy();
    this._tabsSubscription.unsubscribe();
    this._tabLabelSubscription.unsubscribe();
    this._tabBodySubscription.unsubscribe();
  }

  realignInkBar() {
    if (this._tabHeader) {
      this._tabHeader._alignInkBarToSelectedTab();
    }
  }

  updatePagination() {
    if (this._tabHeader) {
      this._tabHeader.updatePagination();
    }
  }

  focusTab(index: number) {
    const header = this._tabHeader;

    if (header) {
      header.focusIndex = index;
    }
  }

  _focusChanged(index: number) {
    this._lastFocusedTabIndex = index;
    this.focusChange.emit(this._createChangeEvent(index));
  }

  private _createChangeEvent(index: number): GnroTabChangeEvent {
    const event = new GnroTabChangeEvent();
    event.index = index;
    if (this._tabs && this._tabs.length) {
      event.tab = this._tabs.toArray()[index];
    }
    return event;
  }

  private _subscribeToTabLabels() {
    if (this._tabLabelSubscription) {
      this._tabLabelSubscription.unsubscribe();
    }

    this._tabLabelSubscription = merge(...this._tabs.map((tab) => tab._stateChanges)).subscribe(() =>
      this._changeDetectorRef.markForCheck(),
    );
  }

  private _clampTabIndex(index: number | null): number {
    return Math.min(this._tabs.length - 1, Math.max(index || 0, 0));
  }

  _getTabLabelId(i: number): string {
    return `${this._groupId}-label-${i}`;
  }

  _getTabContentId(i: number): string {
    return `${this._groupId}-content-${i}`;
  }

  _setTabBodyWrapperHeight(tabHeight: number): void {
    if (!this.dynamicHeight || !this._tabBodyWrapperHeight) {
      this._tabBodyWrapperHeight = tabHeight;
      return;
    }

    const wrapper: HTMLElement = this._tabBodyWrapper.nativeElement;
    wrapper.style.height = this._tabBodyWrapperHeight + 'px';

    if (this._tabBodyWrapper.nativeElement.offsetHeight) {
      wrapper.style.height = tabHeight + 'px';
    }
  }

  _removeTabBodyWrapperHeight(): void {
    const wrapper = this._tabBodyWrapper.nativeElement;
    this._tabBodyWrapperHeight = wrapper.clientHeight;
    wrapper.style.height = '';
    this._ngZone.run(() => this.animationDone.emit());
  }

  _handleClick(tab: GnroTabComponent, tabHeader: GnroTabGroupBaseHeader, index: number) {
    tabHeader.focusIndex = index;

    if (!tab.disabled) {
      this.selectedIndex = index;
    }
  }

  _getTabIndex(index: number): number {
    const targetIndex = this._lastFocusedTabIndex ?? this.selectedIndex;
    return index === targetIndex ? 0 : -1;
  }

  _tabFocusChanged(focusOrigin: FocusOrigin, index: number) {
    if (focusOrigin && focusOrigin !== 'mouse' && focusOrigin !== 'touch') {
      this._tabHeader.focusIndex = index;
    }
  }

  protected _bodyCentered(isCenter: boolean) {
    if (isCenter) {
      this._tabBodies?.forEach((body, i) => body._setActiveClass(i === this._selectedIndex));
    }
  }
}

export class GnroTabChangeEvent {
  index!: number;
  tab!: GnroTabComponent;
}
