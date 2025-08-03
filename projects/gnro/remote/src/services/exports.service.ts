import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ACCEPT_JSON_API_HEADER, GnroBackendService, GnroButtonConfg } from '@gnro/ui/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { GnroRemoteResponse } from '../models/remote.model';

@Injectable({
  providedIn: 'root',
})
export class GnroRemoteExportsService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  exports(params: HttpParams): Observable<HttpResponse<Blob>> {
    //let params = this.backendService.getParams(gridConfig.urlKey, 'export');
    //params = filterHttpParams(gridConfig.columnFilters, columns, params);
    //params = sortHttpParams(gridConfig.sortFields, params);
    const url = this.backendService.apiUrl;
    return this.http.get(url, { params, observe: 'response', responseType: 'blob' });
  }
}
