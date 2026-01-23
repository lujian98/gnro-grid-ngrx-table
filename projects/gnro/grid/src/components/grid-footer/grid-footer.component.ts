import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroNumberFieldComponent, defaultNumberFieldConfig } from '@gnro/ui/fields';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutFooterComponent, GnroLayoutFooterEndComponent } from '@gnro/ui/layout';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip, switchMap, takeUntil } from 'rxjs/operators';
import { GnroGridFacade } from '../../+state/grid.facade';
import { GnroGridConfig, GnroGridSetting } from '../../models/grid.model';

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
export class GnroGridFooterComponent {
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly destroyRef = inject(DestroyRef);
  valueChanged$: BehaviorSubject<number> = new BehaviorSubject(0);
  gridSetting = input.required<GnroGridSetting>();
  gridConfig = input.required<GnroGridConfig>();
  page: number = 1;
  get displaying(): string {
    const total = this.gridSetting().totalCounts;
    if (!this.gridConfig().virtualScroll) {
      const start = this.getStart((this.gridConfig().page - 1) * this.gridConfig().pageSize + 1, total);
      const end = this.getEnd(start + this.gridConfig().pageSize - 1, total);
      return `${start} - ${end}`;
    } else {
      const index = this.getStart(this.gridSetting().scrollIndex + 1, total);
      const endindex = this.getEnd(index + this.gridSetting().viewportSize, total);
      return `${index} - ${endindex}`;
    }
  }
  getStart(start: number, total: number): number {
    return total === 0 ? 0 : start;
  }
  getEnd(end: number, total: number): number {
    return end > total ? total : end;
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
        takeUntilDestroyed(this.destroyRef),
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
    this.gridFacade.getPageData(this.gridConfig().gridName, page);
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
}
