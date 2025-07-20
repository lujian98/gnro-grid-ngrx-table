import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ACCEPT_JSON_API_HEADER, GnroBackendService, GnroButtonConfg } from '@gnro/ui/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { GnroRemoteResponse } from '../models/delete.model';

@Injectable({
  providedIn: 'root',
})
export class GnroRemoteService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  delete(stateId: string, keyName: string, selected: unknown[]): Observable<GnroRemoteResponse[]> {
    let params = this.backendService.getParams(keyName, 'delete');
    const url = this.backendService.apiUrl;

    return forkJoin(
      selected.map((data) => {
        params = params.append('formData', JSON.stringify(data));
        return this.http.delete(url, { params }).pipe(map(() => ({ stateId, keyName })));
      }),
    );
  }

  remoteAction(
    button: GnroButtonConfg,
    keyName: string,
    configType: string,
    formData: object,
  ): Observable<{ keyName: string; configType: string; formData: object }> {
    const headers = new HttpHeaders(ACCEPT_JSON_API_HEADER);

    let params = this.backendService.getParams(keyName, 'update');
    params = params.append('configType', configType);
    const url = this.backendService.apiUrl;
    params = params.append('formData', JSON.stringify(formData));

    return of({ keyName, configType, formData });
    return this.http.put(url, params, { headers: headers }).pipe(
      map((response) => {
        console.log(' res=', response);
        return {
          keyName,
          configType,
          formData,
        };
      }),
    );
  }
}
