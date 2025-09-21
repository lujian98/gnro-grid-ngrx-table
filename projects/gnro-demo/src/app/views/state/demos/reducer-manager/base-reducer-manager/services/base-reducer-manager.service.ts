import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService, GnroDataType } from '@gnro/ui/core';
import { Observable, map } from 'rxjs';
import { BaseReducerManagerConfig } from '../config.model';

@Injectable({
  providedIn: 'root',
})
export class BaseReducerManagerService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  loadData(config: BaseReducerManagerConfig): Observable<GnroDataType[]> {
    console.log(' config=', config);
    let params = this.backendService.getParams('DCR', 'gridData');
    params = params.append('offset', '0');
    params = params.append('limit', config.pageSize);
    const url = this.backendService.apiUrl;
    return this.http.get<any>(url, { params }).pipe(
      map((res) => {
        return res.data;
      }),
    );
  }
}
