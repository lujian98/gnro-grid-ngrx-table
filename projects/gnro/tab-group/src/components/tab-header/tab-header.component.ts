import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GnroTabLabelWrapperDirective } from '../../directives/tab-label-wrapper.directive';
import { GnroInkBar } from '../../directives/ink-bar.directive';
import { GnroPaginatedTabHeaderDirective } from '../../directives/paginated-tab-header.directive';
import { CdkObserveContent } from '@angular/cdk/observers';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroButtonComponent } from '@gnro/ui/button';

@Component({
  selector: 'gnro-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'gnro-mdc-tab-header',
    '[class.gnro-mdc-tab-header-pagination-controls-enabled]': '_showPaginationControls',
    '[class.gnro-mdc-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
  },
  imports: [CommonModule, CdkObserveContent, GnroIconModule, GnroButtonComponent],
})
export class GnroTabHeaderComponent
  extends GnroPaginatedTabHeaderDirective
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  @ContentChildren(GnroTabLabelWrapperDirective, { descendants: false })
  _items!: QueryList<GnroTabLabelWrapperDirective>;
  @ViewChild('tabListContainer', { static: true }) _tabListContainer!: ElementRef;
  @ViewChild('tabList', { static: true }) _tabList!: ElementRef;
  @ViewChild('tabListInner', { static: true }) _tabListInner!: ElementRef;
  @ViewChild('nextPaginator') _nextPaginator!: ElementRef<HTMLElement>;
  @ViewChild('previousPaginator') _previousPaginator!: ElementRef<HTMLElement>;
  _inkBar!: GnroInkBar;

  @Input('aria-label') ariaLabel!: string;
  @Input('aria-labelledby') ariaLabelledby!: string;

  override ngAfterContentInit() {
    this._inkBar = new GnroInkBar(this._items);
    super.ngAfterContentInit();
  }

  protected _itemSelected(event: KeyboardEvent) {
    event.preventDefault();
  }
}
