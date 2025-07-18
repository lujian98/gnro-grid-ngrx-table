import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ACCEPT_JSON_API_HEADER, GnroBackendService, GnroButtonConfg } from '@gnro/ui/core';
import { Observable, map, of, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GnroRemoteService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  delete(stateId: string, keyName: string, selected: unknown[]): Observable<{ stateId: string; keyName: string }[]> {
    const headers = new HttpHeaders(ACCEPT_JSON_API_HEADER);

    let params = this.backendService.getParams(keyName, 'delete');

    const url = this.backendService.apiUrl;
    //params = params.append('formData', JSON.stringify(formData));
    console.log(' 99999 api call perform delete selected=', selected);
    //return of({ stateId, keyName });

    return forkJoin(
      selected.map((data) => {
        console.log(' ddddddddddddd data=', data);
        params = params.append('formData', JSON.stringify(data));
        return this.http.delete(url, { params }).pipe(
          map((response) => {
            console.log(' res=', response);
            return {
              stateId,
              keyName,
            };
          }),
        );
      }),
    );
    /*
    return this.http.put(url, params, { headers: headers }).pipe(
      map((response) => {
        console.log(' res=', response);
        return {
          keyName,
          configType,
          formData,
        };
      }),
    );*/
  }

  /*
    delete(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.delete(`${path}`, { params });
  }

    remove(entity: Entity, selected: Entity[], entityType: string): Observable<Entity[]> {
    const entityPath = (ENTITY_PATH_MAPPINGS as any)[entityType];
    return forkJoin(
      selected.map((data) => this.apiService.delete(`/models/doors/${entity.id}/${entityPath}/${data.id}`))
    );
  }

      return forkJoin(
      deviceGroups.map((data) =>
        this.apiService.post(`/models/device_groups/${data.id}/remove_devices`, {
          device_ids: [entityId],
        })
      )
    );

    */

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
