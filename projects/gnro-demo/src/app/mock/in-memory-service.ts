import { getStatusText, InMemoryDbService, RequestInfo, ResponseOptions, STATUS } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { GnroGridConfig, GnroColumnConfig, GnroGridConfigResponse, GnroColumnConfigResponse } from '@gnro/ui/grid';
import { CARSDATA, DCRBrands, DCRColors, DCRColumnConfig, DCRGridConfig } from '../data/cars-large';
import { GnroTreeConfig } from '@gnro/ui/tree';
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
    DCR_columnConfig: GnroColumnConfigResponse;
    DCR_gridConfig: GnroGridConfigResponse;
    ECR_tree: NestedFoodNode[];
    ECR_columnConfig: GnroColumnConfigResponse;
    ECR_gridConfig: GnroGridConfigResponse;
    NPR_gridConfig: GnroGridConfigResponse;
    NPR_tree: NestedFoodNode[];
    MET_gridConfig: GnroGridConfigResponse;
    MET_columnConfig: GnroColumnConfigResponse;
    RND_gridConfig: GnroGridConfigResponse;
    TST_columnConfig: GnroColumnConfigResponse;

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
    const records = (reqInfo.req as any).body as [];
    const body = [...records].map((item: any) => {
      const find = [...CARSDATA.data].find((data) => data['ID'] === item['ID']);
      return find ? { ...find, ...item } : item;
    });
    return reqInfo.utils.createResponse$(() => {
      const options: ResponseOptions = {
        body: body,
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
    const action = reqInfo.query.get('action');
    if (reqInfo.id) {
      return this.getDataDetail(reqInfo);
    } else if (action?.[0] === 'treeData') {
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
      const sortedData = this.getSortedData(filteredData, reqInfo.query);
      const data = this.getOffsetData(sortedData, reqInfo.query);
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
    const filters: { [index: string]: any } = {};
    [...reqInfo.query.keys()].forEach((key) => {
      if (key.indexOf('_') > 1) {
        const compareKey = this.getCompareKey(key);
        const filterKey = key.substring(0, key.length - compareKey.length - 1);
        const searches = reqInfo.query.get(key)!;
        const search =
          ['in[]', 'in', 'null', 'not_null'].indexOf(compareKey) === -1 ? searches[0].toLowerCase() : searches;
        if (!filters[filterKey]) {
          filters[filterKey] = [];
        }
        const find = filters[filterKey].find(
          (item: any) => `${item.filterKey}_${item.compareKey}` === `${filterKey}_${compareKey}`,
        );
        if (!find) {
          filters[filterKey].push({
            filterKey,
            compareKey,
            searches,
            search,
          });
        }
      }
    });

    Object.keys(filters).forEach((key) => {
      data = data.filter((item) => {
        return this.getFilterCondition(filters[key], item);
      });
    });
    return data;
  }

  private getFilterCondition(filters: any, item: any): boolean {
    let ret: boolean | undefined = undefined;

    let lastType = '';
    let lastKey = '';

    filters.forEach((query: any) => {
      const filterKey = query.filterKey;
      const compareKey = query.compareKey;
      const searches = query.searches;
      const search = query.search;

      const val = this.getFilterDataValue(item[filterKey]);
      const value = this.getTypedValue(search, val, val);
      const filter = this.getTypedValue(search, val, search);
      let newRet: boolean | undefined = undefined;

      switch (compareKey) {
        case 'cont':
          newRet = value && value.toString().toLowerCase().includes(filter.toString());
          break;
        case 'i_cont':
          newRet = value && value.toString().toLowerCase().includes(filter.toString().toLowerCase());
          break;
        case 'in':
        case 'in[]':
          newRet = searches.includes(val);
          break;
        case 'eq':
          newRet = value === filter;
          break;
        case 'not_null':
          newRet = value !== null;
          break;
        case 'null':
          newRet = value === null;
          break;
        case 'gteq':
          newRet = value >= filter;
          break;
        case 'gt':
          newRet = value > filter;
          break;
        case 'lteq':
          newRet = value <= filter;
          break;
        case 'lt':
          newRet = value < filter;
          break;
        case 'start':
          newRet = value && value.toString().startsWith(filter.toString());
          break;
        case 'end':
          newRet = value && value.toString().endsWith(filter.toString());
          break;
      }
      const currentType = filter instanceof Date ? 'date' : 'other';
      if (newRet !== undefined) {
        if (ret !== undefined) {
          if (lastKey === filterKey && currentType === lastType) {
            ret = ret && newRet;
          } else {
            ret = ret || newRet;
          }
        } else {
          ret = newRet;
        }
      }
      lastKey = filterKey;
      lastType = currentType;
    });
    return !!ret;
  }

  private getFilterDataValue(v: any): any {
    if (!v || typeof v === 'number' || typeof v === 'string' || this.isDate(v) || Array.isArray(v)) {
      return v;
    }
    if (typeof v === 'object') {
      const nv = v['name'];
      if (nv) {
        return nv;
      }
    }
    return v;
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
      sortlist.reverse().forEach((aSort: string) => {
        const sort = aSort.split('.');
        data = this.dataSortByField(data, sort[0], sort[1]);
      });
      sortlist.reverse();
    }
    return data;
  }

  private dataSortByField(data: any[], field: string, direction: string) {
    const order = direction === 'asc' ? 1 : -1;
    data.sort((d1: any, d2: any) => {
      //const v1 = (d1 as any)[field];
      //const v2 = (d2 as any)[field];
      const v1 = this.getSortDataValue(d1, field);
      const v2 = this.getSortDataValue(d2, field);
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

  private getSortDataValue(data: any, field: string): any {
    const v = data[field];
    if (!v || typeof v === 'number' || typeof v === 'string' || this.isDate(v) || Array.isArray(v)) {
      return v;
    }
    if (typeof v === 'object') {
      const nv = v['title'];
      if (nv) {
        return nv;
      }
    }
    return v;
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
