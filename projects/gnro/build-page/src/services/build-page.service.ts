import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ACCEPT_JSON_API_HEADER, GnroBackendService } from '@gnro/ui/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GnroBuildPageService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  buildPageConfig(keyName: string, configType: string, configData: object): Observable<any> {
    const headers = new HttpHeaders(ACCEPT_JSON_API_HEADER);
    const url = this.backendService.apiUrl;

    let params = this.backendService.getParams(keyName, 'buildPage');
    params = params.append('configType', configType);
    params = params.append('configData', JSON.stringify(configData));
    return this.http.put(url, params, { headers: headers }).pipe(
      map((res) => {
        console.log(' res=', res);
        return res;
      }),
    );
  }
}
