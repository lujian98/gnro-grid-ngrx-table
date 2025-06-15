import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { uniqueId } from '@icc/ui/core';

@Injectable({
  providedIn: 'root',
})
export class TabsMockService {
  getTabsMockData(): Observable<string[][]> {
    const values = [];
    for (let i = 0; i < 3; i++) {
      const length = Math.floor(Math.random() * 25) + 1;
      const data = Array.from({ length }, (_, i) => uniqueId(16));
      values.push(data);
    }

    return of(values);
  }
}
