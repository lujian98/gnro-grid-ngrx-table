import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService, GrnoDataType } from '@gnro/ui/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  refreshData(): Observable<GrnoDataType[]> {
    let params = this.backendService.getParams('DCR', 'gridData');
    params = params.append('offset', '0');
    params = params.append('limit', '30');
    const url = this.backendService.apiUrl;
    return this.http.get<any>(url, { params }).pipe(
      map((res) => {
        return res.data;
      }),
    );
  }
}
