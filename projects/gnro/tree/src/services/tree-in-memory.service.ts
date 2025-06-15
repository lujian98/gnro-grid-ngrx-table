import { Injectable } from '@angular/core';
import { GnroColumnConfig, GnroGridinMemoryService } from '@gnro/ui/grid';
import { Observable, of } from 'rxjs';
import { GnroTreeConfig, GnroTreeData } from '../models/tree-grid.model';
import { gnroFlattenTree } from '../utils/nested-tree';
import { sortByField } from '@gnro/ui/core';

@Injectable({
  providedIn: 'root',
})
export class GnroTreeinMemoryService extends GnroGridinMemoryService {
  getTreeData<T>(
    treeConfig: GnroTreeConfig,
    columns: GnroColumnConfig[],
    inMemoryData: GnroTreeData[],
  ): Observable<GnroTreeData[]> {
    const sortedData = this.sortTree([...inMemoryData], treeConfig);
    const flatTree = gnroFlattenTree([...sortedData], 0);
    const filterParams = this.getFilterParams(treeConfig.columnFilters, columns);
    const filteredData = this.getFilteredData([...flatTree], filterParams);
    return of([...filteredData] as GnroTreeData[]);
  }

  private sortTree(nodes: GnroTreeData[], treeConfig: GnroTreeConfig): GnroTreeData[] {
    const sorts = treeConfig.sortFields;
    if (sorts && sorts.length > 0 && sorts[0].field === 'name') {
      const sort = sorts[0];
      return this.sortNodes(nodes, sort.field, sort.dir);
    }
    return nodes;
  }

  private sortNodes(nodes: GnroTreeData[], field: string, dir: string): GnroTreeData[] {
    return sortByField([...nodes], field, dir).map((node) => {
      return {
        ...node,
        children: node.children ? this.sortNodes([...node.children], field, dir) : undefined,
      };
    });
  }
}
