import { Injectable } from '@angular/core';
import { GnroDateRange } from '../models/date-range-field.model';
import { Subject } from 'rxjs';

@Injectable()
export class GnroDateRangeStoreService {
  private _fromDate: Date | null = null;
  private _toDate: Date | null = null;

  rangeUpdate$ = new Subject<GnroDateRange | null>();

  get fromDate(): Date | null {
    return this._fromDate;
  }

  get toDate(): Date | null {
    return this._toDate;
  }

  updateRange(fromDate: Date | null, toDate: Date | null) {
    this._fromDate = fromDate;
    this._toDate = toDate;

    if (!this.fromDate && !this.toDate) {
      this.rangeUpdate$.next(null);
    } else {
      this.rangeUpdate$.next({
        fromDate: this.fromDate,
        toDate: this.toDate,
      });
    }
  }
}
