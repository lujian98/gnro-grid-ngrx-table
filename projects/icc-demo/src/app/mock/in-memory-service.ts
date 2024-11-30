import { getStatusText, InMemoryDbService, RequestInfo, ResponseOptions, STATUS } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { IccGridConfig, IccGridComponent, defaultGridConfig, IccColumnConfig } from '@icc/ui/grid';
import { CARSDATA, DCRBrands, DCRColors, DCRColumnConfig, DCRGridConfig } from '../data/cars-large';
import { IccTreeNode, IccTreeConfig } from '@icc/ui/tree';
import {
  TREE_NESTED_DATA,
  NestedFoodNode,
  ECRColumnConfig,
  ECRTreeGridConfig,
  NPRTreeGridConfig,
  METTreeGridConfig,
  RNDTreeGridConfig,
} from '../views/tree/demos/data/tree-data';
import { State, STATES } from '../data/states';
import {
  SingleSelectConfig,
  MultiSelectConfig,
  SingleAutocompleteConfig,
  MultiAutocompleteConfig,
  SingleListConfig,
  MultiListConfig,
  SingleAutocompleteLisConfig,
  MultiAutocompleteListConfig,
} from '../data/select-field-helpers';
import {
  DCRFormConfig,
  DCRFormFields,
  DCRFormData,
  DCR2FormFields,
  DCR2FormData,
  DCR3FormConfig,
  DCR3FormFields,
  DCR3FormData,
} from '../data/form-helper';
import {
  RemoteD3ConfigP1,
  RemoteChartConfigsP1,
  RemoteD3ConfigP2,
  RemoteChartConfigsP2,
  RemoteD3ConfigP3,
  RemoteChartConfigsP3,
  RemoteD3ConfigP4,
  RemoteChartConfigsP4,
  RemoteD3Data,
} from '../data/d3-helper';

export class InMemoryService extends InMemoryDbService {
  createDb(): {
    DCR: any;
    DCR_brand: any[];
    DCR_color: any[];
    DCR_columnConfig: IccColumnConfig[];
    DCR_gridConfig: Partial<IccGridConfig>;
    ECR_tree: NestedFoodNode[];
    ECR_columnConfig: IccColumnConfig[];
    ECR_gridConfig: Partial<IccTreeConfig>;
    NPR_gridConfig: Partial<IccTreeConfig>;
    NPR_tree: NestedFoodNode[];
    MET_gridConfig: Partial<IccTreeConfig>;
    MET_columnConfig: IccColumnConfig[];
    RND_gridConfig: Partial<IccTreeConfig>;
    TST_columnConfig: IccColumnConfig[];

    usa_state: State[];
    usa_statelist: string[];
    usa_SingleRemote: State[];
    usa_SingleRemoteFieldConfig: any;
    usa_MultiRemote: State[];
    usa_MultiRemoteFieldConfig: any;
    usa_SingleAutocompleteRemotes: State[];
    usa_SingleAutocompleteRemotesFieldConfig: any;
    usa_MultiAutocompleteRemotes: State[];
    usa_MultiAutocompleteRemotesFieldConfig: any;
    usa_SingleAllRemoteList: string[];
    usa_SingleAllRemoteListFieldConfig: any;
    usa_MultiAllRemoteList: string[];
    usa_MultiAllRemoteListFieldConfig: any;
    usa_SingleAllAutocompleteRemoteList: string[];
    usa_SingleAllAutocompleteRemoteListFieldConfig: any;
    usa_MultiAllAutocompleteRemotes: string[];
    usa_MultiAllAutocompleteRemotesFieldConfig: any;
    DCR_formConfig: any;
    DCR_formFields: any[];
    DCR_formData: any;

    DCR2_formFields: any[];
    DCR2_formData: any;

    DCR3_formConfig: any;
    DCR3_formFields: any[];
    DCR3_formData: any;

    DCR_d3ConfigP1: any;
    DCR_d3ChartConfigsP1: any[];
    DCR_d3DataP1: any[];
    DCR_d3ConfigP2: any;
    DCR_d3ChartConfigsP2: any[];
    DCR_d3DataP2: any[];
    DCR_d3ConfigP3: any;
    DCR_d3ChartConfigsP3: any[];
    DCR_d3DataP3: any[];
    DCR_d3ConfigP4: any;
    DCR_d3ChartConfigsP4: any[];
    DCR_d3DataP4: any[];
  } {
    return {
      DCR: CARSDATA,
      DCR_brand: DCRBrands,
      DCR_color: DCRColors,
      DCR_columnConfig: DCRColumnConfig,
      DCR_gridConfig: DCRGridConfig,
      ECR_tree: TREE_NESTED_DATA,
      ECR_columnConfig: ECRColumnConfig,
      ECR_gridConfig: ECRTreeGridConfig,
      NPR_gridConfig: NPRTreeGridConfig,
      NPR_tree: TREE_NESTED_DATA,
      MET_gridConfig: METTreeGridConfig,
      MET_columnConfig: ECRColumnConfig,
      RND_gridConfig: RNDTreeGridConfig,
      TST_columnConfig: ECRColumnConfig,

      usa_state: STATES,
      usa_statelist: STATES.map((state) => state.state),
      usa_SingleRemote: STATES,
      usa_SingleRemoteFieldConfig: SingleSelectConfig,
      usa_MultiRemote: STATES,
      usa_MultiRemoteFieldConfig: MultiSelectConfig,
      usa_SingleAutocompleteRemotes: STATES,
      usa_SingleAutocompleteRemotesFieldConfig: SingleAutocompleteConfig,
      usa_MultiAutocompleteRemotes: STATES,
      usa_MultiAutocompleteRemotesFieldConfig: MultiAutocompleteConfig,
      usa_SingleAllRemoteList: [...STATES].map((state) => state.state),
      usa_SingleAllRemoteListFieldConfig: SingleListConfig,
      usa_MultiAllRemoteList: [...STATES].map((state) => state.state),
      usa_MultiAllRemoteListFieldConfig: MultiListConfig,
      usa_SingleAllAutocompleteRemoteList: [...STATES].map((state) => state.state),
      usa_SingleAllAutocompleteRemoteListFieldConfig: SingleAutocompleteLisConfig,
      usa_MultiAllAutocompleteRemotes: [...STATES].map((state) => state.state),
      usa_MultiAllAutocompleteRemotesFieldConfig: MultiAutocompleteListConfig,
      DCR_formConfig: DCRFormConfig,
      DCR_formFields: DCRFormFields,
      DCR_formData: DCRFormData,

      DCR2_formFields: DCR2FormFields,
      DCR2_formData: DCR2FormData,

      DCR3_formConfig: DCR3FormConfig,
      DCR3_formFields: DCR3FormFields,
      DCR3_formData: DCR3FormData,

      DCR_d3ConfigP1: RemoteD3ConfigP1,
      DCR_d3ChartConfigsP1: RemoteChartConfigsP1,
      DCR_d3DataP1: [...RemoteD3Data],
      DCR_d3ConfigP2: RemoteD3ConfigP2,
      DCR_d3ChartConfigsP2: RemoteChartConfigsP2,
      DCR_d3DataP2: [...RemoteD3Data],
      DCR_d3ConfigP3: RemoteD3ConfigP3,
      DCR_d3ChartConfigsP3: RemoteChartConfigsP3,
      DCR_d3DataP3: [...RemoteD3Data],
      DCR_d3ConfigP4: RemoteD3ConfigP4,
      DCR_d3ChartConfigsP4: RemoteChartConfigsP4,
      DCR_d3DataP4: [...RemoteD3Data],
    };
  }

  patch(reqInfo: RequestInfo): Observable<ResponseOptions> {
    const body = reqInfo.collection;
    body.data.attributes = reqInfo.utils.getJsonBody(reqInfo.req)[body.data.type];
    return reqInfo.utils.createResponse$(() => {
      const options: ResponseOptions = {
        body: {},
        status: STATUS.OK,
      };
      return this.finishOptions(options, reqInfo);
    });
  }

  post(reqInfo: RequestInfo): Observable<ResponseOptions> {
    const body = reqInfo.collection;
    return reqInfo.utils.createResponse$(() => {
      const options: ResponseOptions = {
        body: body,
        status: STATUS.OK,
      };
      return this.finishOptions(options, reqInfo);
    });
  }

  put(reqInfo: RequestInfo): Observable<ResponseOptions> {
    const body = reqInfo.collection ? reqInfo.collection : { data: {} };
    body.data.attributes = reqInfo.utils.getJsonBody(reqInfo.req)[body.data.type];
    return reqInfo.utils.createResponse$(() => {
      const options: ResponseOptions = {
        body: body,
        status: STATUS.OK,
      };
      return this.finishOptions(options, reqInfo);
    });
  }

  delete(reqInfo: RequestInfo): Observable<any> {
    return reqInfo.utils.createResponse$(() => {
      const options: ResponseOptions = {
        body: undefined,
        status: STATUS.OK,
      };
      return this.finishOptions(options, reqInfo);
    });
  }

  get(reqInfo: RequestInfo) {
    //console.log( ' reqInfo=', reqInfo)
    const action = reqInfo.query.get('action');
    if (reqInfo.id) {
      return this.getDataDetail(reqInfo);
    } else if (action?.[0] === 'treeData') {
      //console.log( ' action=', action)
      return this.getTreeData(reqInfo);
    } else if (reqInfo.query.size > 0) {
      return this.getQueryData(reqInfo);
    } else {
      return undefined; // let the default GET handle all others
    }
  }

  private getTreeData(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      const collection = reqInfo.collection.slice();
      const body = [...collection];
      const options: ResponseOptions = {
        body: body,
        status: STATUS.OK,
      };
      return this.finishOptions(options, reqInfo);
    });
  }

  private getQueryData(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      const collection = reqInfo.collection.data.slice();
      const filteredData = this.getFilteredData(collection, reqInfo);
      //console.log( ' filteredData=', filteredData)
      const sortedData = this.getSortedData(filteredData, reqInfo.query);
      const data = this.getOffsetData(sortedData, reqInfo.query);
      //console.log( ' offset data=', data)
      const body = {
        totalCounts: filteredData.length,
        data: data,
        /*
        included: reqInfo.collection.included,
        meta: {
          total: filteredData.length,
        },*/
      };
      const options: ResponseOptions = {
        body: body,
        status: STATUS.OK,
      };
      return this.finishOptions(options, reqInfo);
    });
  }

  private getTypedValue(search: any, val: any, value: any): any {
    if (value) {
      search = decodeURIComponent(search);
      value = decodeURIComponent(value);
      if (this.isNumeric(search) && this.isNumeric(val)) {
        return Number(value);
      } else if (this.isDate(search) && this.isDate(val)) {
        return new Date(value);
      }
    }
    return value;
  }

  private getCompareKey(key: string): string {
    const fKey = key.split('_');
    const compareKey = fKey[fKey.length - 1];
    if (compareKey === 'null' && fKey[fKey.length - 2] === 'not') {
      return 'not_null';
    } else if (compareKey === 'cont' && fKey[fKey.length - 2] === 'i') {
      return 'i_cont';
    } else {
      return compareKey;
    }
  }

  private getFilteredData(data: any[], reqInfo: RequestInfo) {
    [...reqInfo.query.keys()].forEach((key) => {
      if (key.indexOf('_') > 1) {
        const compareKey = this.getCompareKey(key);
        const filterKey = key.substring(0, key.length - compareKey.length - 1);
        const searches = reqInfo.query.get(key)!;
        const search =
          ['in[]', 'in', 'null', 'not_null'].indexOf(compareKey) === -1 ? searches[0].toLowerCase() : searches;

        data = data.filter((item) => {
          const val = item[filterKey];
          const value = this.getTypedValue(search, val, val);
          const filter = this.getTypedValue(search, val, search);
          switch (compareKey) {
            case 'cont':
              return value && value.toString().toLowerCase().includes(filter.toString());
            case 'i_cont':
              return value && value.toString().toLowerCase().includes(filter.toString().toLowerCase());
            case 'in':
            case 'in[]':
              return searches.includes(val);
            case 'eq':
              return value === filter;
            case 'not_null':
              return value !== null;
            case 'null':
              return value === null;
            case 'gteq':
              return value >= filter;
            case 'gt':
              return value > filter;
            case 'lteq':
              return value <= filter;
            case 'lt':
              return value < filter;
            case 'start':
              return value && value.toString().startsWith(filter.toString());
            case 'end':
              return value && value.toString().endsWith(filter.toString());
          }
        });
      }
    });
    return data;
  }

  private isNumeric(num: any): boolean {
    return (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) && !isNaN(num as number);
  }

  private isDate(date: any): boolean {
    return !isNaN(Date.parse(date));
  }

  private getSortedData(data: any[], query: any) {
    const sortlist = query.get('order');
    if (sortlist && sortlist.length > 0) {
      sortlist.forEach((aSort: string) => {
        const sort = aSort.split('.');
        //console.log(' sort=', sort)
        data = this.dataSortByField(data, sort[0], sort[1]);
      });
    }
    return data;
  }

  private dataSortByField(data: any[], field: string, direction: string) {
    const order = direction === 'asc' ? 1 : -1;
    //console.log( ' data=', data)
    data.sort((d1: any, d2: any) => {
      const v1 = (d1 as any)[field];
      const v2 = (d2 as any)[field];
      let res = null;
      if (v1 == null && v2 != null) {
        res = -1;
      } else if (v1 != null && v2 == null) {
        res = 1;
      } else if (v1 == null && v2 == null) {
        res = 0;
      } else if (this.isNumeric(v1) && this.isNumeric(v2)) {
        res = Number(v1) < Number(v2) ? -1 : Number(v1) > Number(v2) ? 1 : 0;
      } else if (typeof v1 === 'string' && typeof v2 === 'string') {
        res = v1.localeCompare(v2);
      } else {
        res = v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
      }
      return order * res;
    });
    return data;
  }

  private getOffsetData(data: any[], query: any) {
    const begin = Number(query.get('offset')[0]);
    const end = Number(query.get('limit')[0]) + begin;
    const length = data.length;
    return data.slice(begin, end > length ? length : end);
  }

  private getDataDetail(reqInfo: RequestInfo) {
    return reqInfo.utils.createResponse$(() => {
      const collection = reqInfo.collection.data.slice();
      const id = reqInfo.id;
      const data = id == undefined ? collection : reqInfo.utils.findById(collection, id);
      const body = { data: data };
      const options: ResponseOptions = data
        ? {
            body: body,
            status: STATUS.OK,
          }
        : {
            body: { error: `'Record' with id='${id}' not found` },
            status: STATUS.NOT_FOUND,
          };
      return this.finishOptions(options, reqInfo);
    });
  }

  private finishOptions(options: ResponseOptions, { headers, url }: RequestInfo) {
    options.statusText = getStatusText(options.status!);
    options.headers = headers;
    options.url = url;
    return options;
  }
}
