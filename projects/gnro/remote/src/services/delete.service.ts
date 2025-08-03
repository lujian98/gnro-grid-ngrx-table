import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService } from '@gnro/ui/core';
import { Observable, forkJoin, map } from 'rxjs';
import { GnroRemoteResponse } from '../models/remote.model';

@Injectable({
  providedIn: 'root',
})
export class GnroRemoteDeleteService {
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
}
