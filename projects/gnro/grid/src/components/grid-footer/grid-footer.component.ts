import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild, computed, inject, input } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroNumberFieldComponent, defaultNumberFieldConfig } from '@gnro/ui/fields';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutFooterComponent, GnroLayoutFooterEndComponent } from '@gnro/ui/layout';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, switchMap, takeUntil } from 'rxjs/operators';
import { GnroGridFacade } from '../../+state/grid.facade';
import { GnroGridConfig, GnroGridSetting } from '../../models/grid-column.model';

@Component({
  selector: 'gnro-grid-footer',
  templateUrl: './grid-footer.component.html',
  styleUrls: ['./grid-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GnroIconModule,
    TranslatePipe,
    GnroNumberFieldComponent,
    GnroButtonComponent,
    GnroLayoutFooterComponent,
    GnroLayoutFooterEndComponent,
  ],
})
export class GnroGridFooterComponent implements OnDestroy {
  private readonly gridFacade = inject(GnroGridFacade);
  private destroy$ = new Subject<void>();
  valueChanged$: BehaviorSubject<number> = new BehaviorSubject(0);
  gridSetting = input.required<GnroGridSetting>();
  gridConfig = input.required<GnroGridConfig>();
  page: number = 1;
  get displaying(): string {
    if (!this.gridConfig().virtualScroll) {
      const start = (this.gridConfig().page - 1) * this.gridConfig().pageSize + 1;
      let end = start + this.gridConfig().pageSize - 1;
      if (end > this.gridSetting().totalCounts) {
        end = this.gridSetting().totalCounts;
      }
      return `${start} - ${end}`;
    } else {
      const index = this.gridSetting().scrollIndex + 1;
      const endindex = index + this.gridSetting().viewportSize;
      return `${index} - ${endindex}`;
    }
  }
  lastPage = computed(() => {
    return Math.ceil(this.gridSetting().totalCounts / this.gridConfig().pageSize) - 0;
  });
  fieldConfig$ = computed(() => {
    if (this.gridConfig()) {
      this.page = this.gridConfig().page;
      return {
        ...defaultNumberFieldConfig,
        fieldLabel: 'GNRO.UI.GRID.PAGE',
        editable: true,
        minValue: 1,
        maxValue: this.lastPage(),
        labelWidth: 25,
        fieldWidth: 50,
      };
    } else {
      return undefined;
    }
  });

  @ViewChild(GnroNumberFieldComponent, { static: false }) pageField!: GnroNumberFieldComponent;

  constructor() {
    this.valueChanged$
      .pipe(
        skip(1),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((page) => {
          return of(page).pipe(takeUntil(this.valueChanged$.pipe(skip(1))));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.getGridPageData(this.page));
  }

  refreshData(page: number): void {
    if (this.gridConfig().virtualScroll) {
      this.getGridPageData(1);
    } else {
      this.getGridPageData(page);
    }
  }

  getGridPageData(page: number): void {
    this.gridFacade.getGridPageData(this.gridSetting().gridId, page);
  }

  onValueChange(page: number | null): void {
    if (page !== null) {
      if (page < 1) {
        page = 1;
        this.pageField.patchValue(page);
      } else if (page > this.lastPage()) {
        page = this.lastPage();
        this.pageField.patchValue(page);
      }
      this.page = page;
      this.valueChanged$.next(page);
    }
  }

  ngOnDestroy(): void {
    this.valueChanged$.next(0);
    this.valueChanged$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
