import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroBUTTONS, GnroButtonConfg, GnroObjectType } from '@gnro/ui/core';
import { GnroFormWindowConfig } from '@gnro/ui/form-window';
import {
  GnroButtonClick,
  GnroColumnConfig,
  GnroGridComponent,
  GnroGridConfig,
  GnroGridData,
  GnroGridFacade,
  defaultGridConfig,
} from '@gnro/ui/grid';
import { CARSDATA3, DCRBrands, DCRBrandsList, DCRColorsList, MakerColorList } from '../../../data/cars-large';
import { MockFormConfig, MockFormFields, MockValues, MockWindowConfig } from './model-help.spec';

@Component({
  selector: 'app-grid-cell-edit-text',
  template: `<gnro-grid
    [gridConfig]="gridConfig"
    [columnsConfig]="columnsConfig"
    [buttons]="buttons"
    [gridData]="gridData"
    (gnroButtonClick)="buttonClick($event)"
  ></gnro-grid>`,
  styles: [':host {  display: flex; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroGridComponent],
})
export class AppGridCellEditTextComponent {
  private gridFacade = inject(GnroGridFacade);

  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    urlKey: 'DCR',
    //horizontalScroll: true,
    columnSticky: true,
    columnSort: true,
    columnFilter: true,
    columnResize: true,
    columnReorder: true,
    columnMenu: true,
    columnHidden: true,
    rowSelection: true,
    recordKey: 'ID',
    //refreshRate: 10,
    sortFields: [
      {
        field: 'brand',
        dir: 'asc',
      },
    ],
    remoteColumnsConfig: false,
    remoteGridData: false,
    hasDetailView: true,
  };

  buttons: GnroButtonConfg[] = [
    { title: 'Reload', name: 'Reload' },
    GnroBUTTONS.Add,
    GnroBUTTONS.Open,
    GnroBUTTONS.Edit,
    GnroBUTTONS.Save,
    GnroBUTTONS.Reset,
    GnroBUTTONS.View,
    GnroBUTTONS.Delete,
    GnroBUTTONS.Refresh,
    GnroBUTTONS.ClearAllFilters,
    GnroBUTTONS.Import,
    GnroBUTTONS.Export,
  ];

  columnsConfig: GnroColumnConfig[] = [
    {
      name: 'ID',
      width: 50,
      align: 'center',
    },
    {
      name: 'vin',
      width: 100,
      cellEditable: true,
      rendererFieldConfig: {
        required: true,
      },
    },
    {
      name: 'brand',
      width: 100,
      cellEditable: true,
      rendererType: GnroObjectType.Select,
      rendererFieldConfig: {
        options: DCRBrandsList,
        remoteOptions: false,
        multiSelection: false,
      },
      filterFieldConfig: {
        fieldType: GnroObjectType.Select,
        multiSelection: true,
        remoteOptions: false,
        options: DCRBrands.options,
      },
    },
    {
      name: 'MakeDate',
      title: 'Manufacture Date',
      width: 100,
      cellEditable: true,
      rendererType: GnroObjectType.Date,
      rendererFieldConfig: {
        dateFormat: 'longDate',
      },
      filterField: GnroObjectType.DateRange,
      align: 'center',
    },
    {
      name: 'Price',
      width: 70,
      cellEditable: true,
      rendererType: GnroObjectType.Number,
      rendererFieldConfig: {
        decimals: 2,
        required: true,
      },
      filterField: GnroObjectType.Number,
      align: 'right',
    },
    {
      name: 'MakerColor',
      cellEditable: true,
      rendererType: GnroObjectType.Select,
      rendererFieldConfig: {
        optionKey: 'name',
        optionLabel: 'title',
        options: MakerColorList,
        remoteOptions: false,
      },
      filterFieldConfig: {
        fieldType: 'select',
        multiSelection: true,
        remoteOptions: false,
        options: MakerColorList,
        optionKey: 'name',
        optionLabel: 'title',
      },
      width: 100,
    },
    {
      name: 'year',
      rendererType: GnroObjectType.Number,
      cellEditable: true,
      width: 50,
      align: 'right',
    },
    {
      name: 'color',
      width: 80,
      rendererType: GnroObjectType.Select,
      cellEditable: true,
      rendererFieldConfig: {
        fieldType: GnroObjectType.Select,
        options: DCRColorsList,
        remoteOptions: false,
      },
      filterFieldConfig: {
        fieldType: GnroObjectType.Select,
        options: DCRColorsList,
        remoteOptions: false,
      },
      align: 'center',
    },
  ];
  gridData: GnroGridData<any> = CARSDATA3;

  formWindowConfig: GnroFormWindowConfig = {
    windowConfig: MockWindowConfig,
    formConfig: MockFormConfig,
    formFields: [], //MockFormFields,
    //values: MockValues,
  };

  buttonClick(buttonClick: GnroButtonClick): void {
    if (buttonClick.button.name === 'Reload') {
      const gridSetting = buttonClick.gridSetting;
      this.gridFacade.getGridData(gridSetting.gridId, gridSetting);
    }
  }
}
