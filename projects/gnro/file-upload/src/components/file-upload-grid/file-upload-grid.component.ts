import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroColumnConfig, GnroGridComponent, GnroGridConfig, defaultGridConfig } from '@gnro/ui/grid';
import { GnroFileUploadFacade } from '../../+state/file-upload.facade';

@Component({
  selector: 'gnro-file-upload-grid',
  templateUrl: './file-upload-grid.component.html',
  styles: [':host { width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroGridComponent],
})
export class GnroFileUploadGridComponent {
  private readonly fileUploadFacade = inject(GnroFileUploadFacade);
  gridData$ = this.fileUploadFacade.getUploadFilesGridData$;

  gridConfig: GnroGridConfig = {
    ...defaultGridConfig,
    verticalScroll: true,
    columnSort: true,
    columnResize: true,
    sortFields: [
      {
        field: 'fieldName',
        dir: 'asc',
      },
    ],
    pageSize: 1000,
    hideTopbar: true,
    hideGridFooter: true,
    remoteColumnsConfig: false,
    remoteGridData: false,
  };
  columnsConfig: GnroColumnConfig[] = [
    {
      name: 'fieldName',
      title: 'GNRO.UI.FIELDS.FIELD_NAME',
      width: 50,
      align: 'center',
    },
    {
      name: 'filename',
      title: 'GNRO.UI.FILE.NAME',
    },
    {
      name: 'type',
      title: 'GNRO.UI.FILE.TYPE',
      width: 50,
      align: 'center',
    },
    {
      name: 'size',
      title: 'GNRO.UI.FILE.SIZE',
      width: 50,
      align: 'center',
    },
  ];
}
