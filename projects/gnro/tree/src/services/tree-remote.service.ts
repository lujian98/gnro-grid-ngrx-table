import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { GnroBackendService } from '@gnro/ui/core';
import { GnroColumnConfig } from '@gnro/ui/grid';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GnroTreeConfig, GnroTreeData } from '../models/tree-grid.model';

@Injectable({
  providedIn: 'root',
})
export class GnroTreeRemoteService {
  private readonly http = inject(HttpClient);
  private readonly backendService = inject(GnroBackendService);

  getTreeRemoteData<T>(treeConfig: GnroTreeConfig, columns: GnroColumnConfig[]): Observable<GnroTreeData[]> {
    let params = this.backendService.getParams(treeConfig.urlKey, 'treeData');
    const offset = (treeConfig.page - 1) * treeConfig.pageSize;
    const limit = treeConfig.pageSize;
    params = params.append('offset', offset.toString());
    params = params.append('limit', limit.toString());
    const url = this.backendService.apiUrl;
    return this.http.get<GnroTreeData[]>(url, { params }).pipe(
      map((res) => {
        return res;
      }),
      catchError((error) =>
        throwError(() => {
          return error;
        }),
      ),
    );
  }
}
