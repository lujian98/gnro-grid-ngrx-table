import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GnroObjectType } from '@gnro/ui/core';
import { GnroFormField } from '@gnro/ui/fields';
import { BehaviorSubject, debounceTime, of, skip, switchMap, takeUntil } from 'rxjs';
import { GnroGridFacade } from '../../+state/grid.facade';
import { GnroColumnConfig, GnroFilterValueType, GnroGridConfig, GnroGridSetting } from '../../models/grid.model';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroFieldFilterComponent implements AfterViewInit {
  private readonly gridFacade = inject(GnroGridFacade);
  protected readonly destroyRef = inject(DestroyRef);
  protected _value: GnroFilterValueType = '';

  changeDetectorRef = inject(ChangeDetectorRef);
  filterChanged$ = new BehaviorSubject<GnroFilterValueType>(null);
  private _gridConfig!: GnroGridConfig;
  column!: GnroColumnConfig;
  fieldConfig!: Partial<GnroFormField>;

  gridSetting!: GnroGridSetting;
  set gridConfig(value: GnroGridConfig) {
    this._gridConfig = { ...value };
    this.checkField();

    const find = this.gridConfig.columnFilters.find((column) => column.name === this.column.name);
    if (find) {
      this.value = find.value as string;
    } else {
      this.value = this.column.filterField === GnroObjectType.Select ? [] : '';
    }
    this.changeDetectorRef.markForCheck();
  }
  get gridConfig(): GnroGridConfig {
    return this._gridConfig;
  }

  set value(val: GnroFilterValueType) {
    this._value = val;
  }

  get value(): GnroFilterValueType {
    return this._value;
  }

  ngAfterViewInit(): void {
    this.filterChanged$
      .pipe(
        skip(1),
        debounceTime(500),
        //distinctUntilChanged(), //WARNING not need distinct change here
        switchMap((filterValue) => of(filterValue).pipe(takeUntil(this.filterChanged$.pipe(skip(1))))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((filterValue) => {
        this.applyFilter(filterValue);
      });
  }

  checkField(): void {}

  applyFilter(filterValue: GnroFilterValueType): void {
    this.value = filterValue;
    let columnFilters = [...this.gridConfig.columnFilters];

    const find = this.gridConfig.columnFilters.find((column) => column.name === this.column.name);
    if (find) {
      columnFilters = columnFilters.filter((col) => col.name !== this.column.name);
    }
    if (this.value) {
      columnFilters.push({
        name: this.column.name,
        value: this.value,
      });
    }
    this.gridFacade.setGridColumnFilters(this.gridConfig, this.gridSetting, columnFilters);
  }
}
