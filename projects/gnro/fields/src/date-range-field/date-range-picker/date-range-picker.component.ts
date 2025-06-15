import { OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroCalendarComponent, GnroCalendarConfig, GnroPickerOverlayAnimations } from '@gnro/ui/calendar';
import {
  GnroLayoutComponent,
  GnroLayoutFooterCenterComponent,
  GnroLayoutFooterComponent,
  GnroLayoutFooterEndComponent,
  GnroLayoutFooterStartComponent,
} from '@gnro/ui/layout';
import { TranslateDirective, TranslateService } from '@ngx-translate/core';
import { take, timer } from 'rxjs';
import { GnroSelectFieldComponent } from '../../select-field/select-field.component';
import {
  GnroDateRangeFieldConfig,
  GnroDateRangePresetItem,
  defaultDateRangeFieldConfig,
  gnroDefaultDateRangePresets,
  presetSelectionConfig,
} from '../models/date-range-field.model';
import { GnroDateRangeStoreService } from '../services/date-range-store.service';

@Component({
  selector: 'gnro-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GnroPickerOverlayAnimations.transformPanel],
  imports: [
    GnroButtonComponent,
    TranslateDirective,
    GnroCalendarComponent,
    GnroLayoutComponent,
    GnroLayoutFooterComponent,
    GnroLayoutFooterEndComponent,
    GnroLayoutFooterStartComponent,
    GnroLayoutFooterCenterComponent,
    GnroSelectFieldComponent,
  ],
})
export class GnroDateRangePickerComponent implements AfterViewInit, OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private overlayRef = inject(OverlayRef);
  private translateService = inject(TranslateService);
  private rangeStoreService = inject(GnroDateRangeStoreService);
  private adapter = inject(DateAdapter<Date>);
  private _fieldConfig!: GnroDateRangeFieldConfig;

  fromCalendarConfig!: Partial<GnroCalendarConfig>;
  toCalendarConfig!: Partial<GnroCalendarConfig>;
  fromDate!: Date | null;
  toDate!: Date | null;
  selectedRangeDates: Array<Date> = [];
  shouldAnimate: string = 'enter'; // 'enter' : 'noop';

  set fieldConfig(fieldConfig: GnroDateRangeFieldConfig) {
    this._fieldConfig = fieldConfig;
    this._fieldConfig = { ...defaultDateRangeFieldConfig, ...fieldConfig };

    this.fromCalendarConfig = {
      viewType: 'rangeFrom',
      selectedLabel: this.fieldConfig.startDateLabel,
      dateFormat: this.fieldConfig.dateFormat,
      excludeWeekends: this.fieldConfig.excludeWeekends,
      minDate: this.fieldConfig.fromMinMax.fromDate,
      maxDate: this.fieldConfig.fromMinMax.toDate,
    };

    this.toCalendarConfig = {
      viewType: 'rangeTo',
      selectedLabel: this.fieldConfig.endDateLabel,
      dateFormat: this.fieldConfig.dateFormat,
      excludeWeekends: this.fieldConfig.excludeWeekends,
      minDate: this.fieldConfig.toMinMax.fromDate,
      maxDate: this.fieldConfig.toMinMax.toDate,
    };
  }
  get fieldConfig(): GnroDateRangeFieldConfig {
    return this._fieldConfig;
  }

  presetSelectionConfig = presetSelectionConfig;
  presets: GnroDateRangePresetItem[] = [];

  ngOnInit(): void {
    this.adapter.setLocale(this.translateService.currentLang);
    this.fromDate = this.rangeStoreService.fromDate;

    this.presets = [...gnroDefaultDateRangePresets].map((item) => {
      return {
        label: this.translateService.instant(item.label),
        range: item.range,
      };
    });
  }

  ngAfterViewInit(): void {
    this.toDate = this.rangeStoreService.toDate;
    if (this.fromDate) {
      this.toCalendarConfig = {
        ...this.toCalendarConfig,
        minDate: this.getRangeToMinDate(),
      };
    }

    timer(100)
      .pipe(take(1))
      .subscribe(() => {
        if (this.toDate && !this.isRangeInCurrentMonth()) {
          this.toMonthViewChange(this.toDate);
        }
        this.setSelectedRangeDates();
      });
  }

  private getRangeToMinDate(): Date | null {
    const current = new Date();
    const newMonth = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    if (this.isSameMonth(this.fromDate, this.toDate)) {
      if (this.isSameMonth(this.fromDate, newMonth) || this.fromDate!.getTime() > newMonth.getTime()) {
        return new Date(this.fromDate!.getFullYear(), this.fromDate!.getMonth() + 0, 1);
      }
    }
    return new Date(this.fromDate!.getFullYear(), this.fromDate!.getMonth() + 1, 1);
  }

  private isSameMonth(date: Date | null, pDate: Date | null): boolean {
    return date?.getFullYear() === pDate?.getFullYear() && date?.getMonth() === pDate?.getMonth();
  }

  private isRangeInCurrentMonth(): boolean {
    const date = this.toDate;
    const pDate = this.fromDate;
    if (date && pDate && date.getFullYear() === pDate.getFullYear() && date.getMonth() === pDate.getMonth()) {
      const tDate = new Date();
      if (date.getFullYear() === tDate.getFullYear() && date.getMonth() === tDate.getMonth()) {
        return true;
      }
    }
    return false;
  }

  updateFromDate(date: Date | null): void {
    this.checkSelectDateRange(date, 'from');
  }

  updateToDate(date: Date | null): void {
    this.checkSelectDateRange(date, 'to');
  }

  private checkSelectDateRange(date: Date | null, type: string): void {
    if (this.fromDate && this.toDate) {
      if (type === 'from') {
        this.fromDate = date;
        this.toDate = null;
      } else if (type === 'to') {
        this.fromDate = null;
        this.toDate = date;
      }
    } else {
      if (!this.fromDate) {
        this.fromDate = date;
      } else {
        this.toDate = date;
      }
    }
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      const tdate = this.fromDate;
      this.fromDate = this.toDate;
      this.toDate = tdate;
    }

    if (date && type === 'to' && !this.toDate) {
      this.toDate = date;
      this.fromDate = null;
    }
    this.setSelectedRangeDates();
  }

  private setSelectedRangeDates(): void {
    this.selectedRangeDates = [];

    if (this.fromDate && this.toDate) {
      let mdate = new Date(this.fromDate.getTime());
      mdate = new Date(mdate.setDate(mdate.getDate() - 1));
      while (mdate < this.toDate) {
        this.selectedRangeDates.push(mdate);
        mdate = new Date(mdate.setDate(mdate.getDate() + 1));
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  fromMonthViewChange(date: Date): void {
    this.toCalendarConfig = {
      ...this.toCalendarConfig,
      minDate: new Date(date.getFullYear(), date.getMonth() + 1, 1),
    };
  }

  toMonthViewChange(date: Date): void {
    this.fromCalendarConfig = {
      ...this.fromCalendarConfig,
      maxDate: new Date(date.getFullYear(), date.getMonth(), 0),
    };
  }

  updateRangeByPreset(item: GnroDateRangePresetItem): void {
    this.fromDate = null;
    this.toDate = null;
    this.updateFromDate(item.range.fromDate ? item.range.fromDate : null);

    timer(50)
      .pipe(take(1))
      .subscribe(() => this.updateToDate(item.range.toDate ? item.range.toDate : null));
  }

  applyNewDates(e: MouseEvent): void {
    if (this.fromDate && !this.toDate) {
      this.toDate = new Date(this.fromDate);
    } else if (!this.fromDate && this.toDate) {
      this.fromDate = new Date(this.toDate);
    }
    if (this.toDate && this.fromDate?.getTime() === this.toDate?.getTime()) {
      this.toDate = new Date(this.toDate.setDate(this.toDate.getDate() + 1));
    }
    this.rangeStoreService.updateRange(this.fromDate, this.toDate);
    this.disposeOverLay();
  }

  discardNewDates(e: MouseEvent): void {
    this.disposeOverLay();
  }

  private disposeOverLay(): void {
    this.overlayRef.dispose();
  }
}
