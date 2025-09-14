import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GnroBackendService } from '@gnro/ui/core';
import { GrnoDataType } from '@gnro/ui/core';

@Injectable({
  providedIn: 'root',
})
export class AppBaseStoreService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  loadData(): Observable<GrnoDataType[]> {
    let params = this.backendService.getParams('DCR', 'gridData');
    params = params.append('offset', '0');
    params = params.append('limit', '20');
    const url = this.backendService.apiUrl;
    return this.http.get<any>(url, { params }).pipe(
      map((res) => {
        //console.log( ' xxxx5555555555555 res=', res)
        return res.data;
      }),
    );
  }
}
