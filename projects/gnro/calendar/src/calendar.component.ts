import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnChanges,
  ViewChild,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCalendar, MatCalendarCellCssClasses, MatCalendarUserEvent } from '@angular/material/datepicker';
import { GnroLocaleDatePipe } from '@gnro/ui/core';
import { TranslateDirective } from '@ngx-translate/core';
import { take, timer } from 'rxjs';
import { GnroCalendarConfig, defaultCalendarConfig } from './models/calendar.model';

@Component({
  selector: 'gnro-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateDirective, GnroLocaleDatePipe, MatCalendar],
})
export class GnroCalendarComponent implements AfterViewInit, OnChanges {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private currentMonth!: Date | null;
  minDate!: Date | null;
  maxDate!: Date | null;
  weekendFilter = (d: Date) => true;

  calendarConfig = input(defaultCalendarConfig, {
    transform: (value: Partial<GnroCalendarConfig>) => {
      const calendarConfig = { ...defaultCalendarConfig, ...value };
      if (calendarConfig.excludeWeekends) {
        this.weekendFilter = (d: Date): boolean => {
          const day = d.getDay();
          return day !== 0 && day !== 6;
        };
      }
      this.minDate = calendarConfig.minDate;
      this.maxDate = calendarConfig.maxDate;
      return calendarConfig;
    },
  });
  selectedDate = input(null, {
    transform: (value: Date | null) => {
      if (value instanceof Date) {
        this.matCalendar.activeDate = value;
        return value;
      } else {
        if (this.calendarConfig().viewType === 'rangeTo') {
          const current = new Date();
          this.matCalendar.activeDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
        }
        return null;
      }
    },
  });
  selectedRangeDates = input([], {
    transform: (value: Array<Date>) => {
      if (this.selectedDate()) {
        this.matCalendar.activeDate = this.selectedDate()!;
      } else {
        this.matCalendar.activeDate = new Date();
      }
      this.changeDetectorRef.detectChanges();
      return value;
    },
  });
  selectedDateChange = output<Date | null>();
  monthViewChange = output<Date>();

  @ViewChild(MatCalendar, { static: true }) matCalendar!: MatCalendar<Date>;

  constructor() {
    this.currentMonth = this.getFirstDay(new Date());
  }

  ngAfterViewInit(): void {
    if (this.matCalendar) {
      this.matCalendar.stateChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.onMonthSelected(this.matCalendar.activeDate);
      });
    }
  }

  ngOnChanges(): void {
    // Material calendar bug - sometime not able refresh view when set maxDate/minDate
    // matCalendar.activeDate need add to input changes (not here) except with min/max in the calendarConfig
    if (!this.maxDate) {
      this.maxDate = new Date('2222-06-24T18:30:00.000Z');
      timer(10)
        .pipe(take(1))
        .subscribe(() => {
          this.maxDate = null;
          this.changeDetectorRef.detectChanges();
        });
    }
    if (!this.minDate) {
      this.minDate = new Date('1900-01-01T18:30:00.000Z');
      timer(10)
        .pipe(take(1))
        .subscribe(() => {
          this.minDate = null;
          this.changeDetectorRef.markForCheck();
        });
    }
  }

  onSelectedChange(date: Date | null): void {
    this.selectedDateChange.emit(date ? date : null);
  }

  onMonthSelected(date: Date): void {
    if (date) {
      const newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      if (this.currentMonth && !this.isSameMonth(newMonth, this.currentMonth)) {
        this.currentMonth = newMonth;
        this.monthViewChange.emit(newMonth);
      }
    }
  }

  private isSameMonth(date: Date, pDate: Date): boolean {
    return date.getFullYear() === pDate.getFullYear() && date.getMonth() === pDate.getMonth();
  }

  private getFirstDay(date: Date): Date | null {
    if (date) {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return null;
  }

  onYearSelected(e: Date): void {}

  onUserSelection(e: MatCalendarUserEvent<Date | null>): void {}

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      if (this.selectedRangeDates().length > 0) {
        const find = this.selectedRangeDates().findIndex(
          (d) =>
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear(),
        );
        if (find === 0) {
          return 'gnro-date-range-selected-date-start';
        } else if (find === this.selectedRangeDates().length - 1) {
          return 'gnro-date-range-selected-date-end';
        } else if (find > 0) {
          return 'gnro-date-range-dates';
        }
      }
      return '';
    };
  }
}
