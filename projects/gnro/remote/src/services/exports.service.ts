import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService } from '@gnro/ui/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GnroRemoteExportsService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  exports(params: HttpParams): Observable<HttpResponse<Blob>> {
    const url = this.backendService.apiUrl;
    return this.http.get(url, { params, observe: 'response', responseType: 'blob' });
  }
}
