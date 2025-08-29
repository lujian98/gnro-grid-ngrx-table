import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import {
  GnroLayoutComponent,
  GnroLayoutFooterComponent,
  GnroLayoutHeaderComponent,
  GnroLayoutHorizontalComponent,
} from '@gnro/ui/layout';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroWindowComponent, defaultWindowConfig } from '@gnro/ui/window';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroColumnConfig, GnroGridComponent, GnroGridData, GnroGridConfig } from '@gnro/ui/grid';
//import { CARSDATA3 } from './cars-large';

@Component({
  selector: 'gnro-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
    GnroLayoutComponent,
    GnroLayoutFooterComponent,
    GnroLayoutHeaderComponent,
    GnroLayoutHorizontalComponent,
    GnroButtonComponent,
    GnroWindowComponent,
    GnroGridComponent,
  ],
})
export class GnroImportsComponent {
  private dialogRef = inject(GnroDialogRef<GnroImportsComponent>);
  params!: HttpParams;

  windowConfig = {
    ...defaultWindowConfig,
    title: 'GNRO.UI.ACTIONS.IMPORT',
    width: '1000px',
    height: '600px',
  };

  gridConfig: Partial<GnroGridConfig> = {
    //...defaultGridConfig,
    urlKey: 'Imports',
    hideTopbar: true,
    //columnSort: true,
    columnResize: true,
    columnReorder: true,
    //columnMenu: true,
    //columnHidden: true,
  };

  columnsConfig: GnroColumnConfig[] = [
    {
      name: 'ID',
      width: 50,
      align: 'center',
    },
    {
      name: 'vin',
      title: 'Vin#',
    },
    {
      name: 'brand',
    },
    {
      name: 'year',
      width: 50,
      align: 'right',
    },
    {
      name: 'color',
      width: 80,
      align: 'center',
    },
  ];
  //gridData: GnroGridData<any> = CARSDATA3;

  export(): void {
    //this.dialogRef.close(params);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
