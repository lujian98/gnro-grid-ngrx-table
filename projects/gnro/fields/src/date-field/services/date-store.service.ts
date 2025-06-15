import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GnroDateStoreService {
  private _selectedDate!: Date | null;
  updateSelected$ = new Subject<Date | null>();

  get selectedDate(): Date | null {
    return this._selectedDate;
  }

  updateSelected(selectedDate: Date | null): void {
    this._selectedDate = selectedDate;
    this.updateSelected$.next(this._selectedDate ? this._selectedDate : null);
  }

  clearSelected(): void {
    this._selectedDate = null;
    this.updateSelected$.next(null);
  }
}
