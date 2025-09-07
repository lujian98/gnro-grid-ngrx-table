import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import {
  GnroButtonConfg,
  GnroBUTTONS,
  GnroButtonType,
  GnroTaskService,
  GnroTasksService,
  uniqueId,
} from '@gnro/ui/core';
import { GnroFormWindowConfig } from '@gnro/ui/form-window';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroLayoutComponent, GnroLayoutHeaderComponent } from '@gnro/ui/layout';
import { GnroSpinnerDirective } from '@gnro/ui/spinner';
import { GnroGridStateModule } from './+state/grid-state.module';
import { GnroGridFacade } from './+state/grid.facade';
import { GnroGridFooterComponent } from './components/grid-footer/grid-footer.component';
import { GnroGridViewComponent } from './components/grid-view.component';
import { defaultGridConfig, defaultGridSetting } from './models/default-grid';
import { GnroColumnConfig, GnroGridConfig, GnroGridData, GnroGridSetting } from './models/grid.model';

export interface GnroButtonClick {
  button: GnroButtonConfg;
  gridConfig: GnroGridConfig;
  gridSetting: GnroGridSetting;
}

@Component({
  selector: 'gnro-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GnroIconModule,
    GnroGridStateModule,
    GnroGridViewComponent,
    GnroGridFooterComponent,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    GnroSpinnerDirective,
  ],
})
export class GnroGridComponent<T> implements OnInit, OnDestroy {
  private readonly gridFacade = inject(GnroGridFacade);
  private readonly tasksService = inject(GnroTasksService);
  private gridId = `grid-${uniqueId()}`;
  gridConfig$ = this.gridFacade.getConfig(this.gridId);
  gridSetting$ = this.gridFacade.getSetting(this.gridId);
  columnsConfig$ = this.gridFacade.getColumnsConfig(this.gridId);
  rowSelection$ = this.gridFacade.getRowSelection(this.gridId);
  gridData$ = this.gridFacade.getSignalData(this.gridId);
  buttons = input<GnroButtonConfg[]>([GnroBUTTONS.Refresh, GnroBUTTONS.ClearAllFilters]);
  gridConfig = input(defaultGridConfig, {
    transform: (value: Partial<GnroGridConfig>) => {
      const config = { ...defaultGridConfig, ...value };
      this.initGridConfig(config);
      return config;
    },
  });
  columnsConfig = input([], {
    transform: (columnsConfig: GnroColumnConfig[]) => {
      if (!this.gridConfig$().remoteColumnsConfig && columnsConfig.length > 0) {
        const gridSetting = { ...defaultGridSetting, gridId: this.gridId };
        this.gridFacade.setColumnsConfig(this.gridConfig$(), gridSetting, columnsConfig);
      }
      return columnsConfig;
    },
  });
  gridData = input(undefined, {
    transform: (gridData: GnroGridData<T> | undefined) => {
      if (!this.gridConfig$().remoteGridData && gridData) {
        this.gridFacade.setInMemoryData(this.gridId, this.gridConfig$(), gridData as GnroGridData<object>);
      }
      return gridData;
    },
  });
  formWindowConfig = input(undefined, {
    transform: (formWindowConfig: GnroFormWindowConfig) => {
      this.gridFacade.setFormWindowConfig(this.gridId, formWindowConfig);
      return formWindowConfig;
    },
  });
  buttons$ = computed(() => {
    return [...this.buttons()].map((button) => {
      const hidden = this.getHidden(button);
      const disabled = this.getDisabled(button);
      return {
        ...button,
        hidden,
        disabled,
      };
    });
  });
  gnroButtonClick = output<GnroButtonClick>();
  gnroGridId = output<string>();

  constructor() {
    this.initGridConfig({ ...defaultGridConfig });
  }

  ngOnInit(): void {
    this.tasksService.loadTaskService(this.gridId, this.gridFacade as GnroTaskService, this.gridConfig());
  }

  private initGridConfig(config: GnroGridConfig): void {
    this.gridFacade.initConfig(this.gridId, config, 'grid');
    this.gnroGridId.emit(this.gridId);
  }

  private getDisabled(button: GnroButtonConfg): boolean {
    switch (button.name) {
      case GnroButtonType.Save:
      case GnroButtonType.Reset:
        return !this.gridSetting$().recordModified;
      case GnroButtonType.Open:
        return !(this.gridConfig().hasDetailView && this.rowSelection$()?.selected === 1);
      case GnroButtonType.Delete:
        return !(this.gridConfig().hasDetailView && this.rowSelection$()?.selected! > 0);
      default:
        return false;
    }
  }

  private getHidden(button: GnroButtonConfg): boolean {
    switch (button.name) {
      case GnroButtonType.Add:
      case GnroButtonType.Edit:
      case GnroButtonType.Open:
      case GnroButtonType.Delete:
      case GnroButtonType.Refresh:
      case GnroButtonType.ClearAllFilters:
        return this.gridSetting$().gridEditable;
      case GnroButtonType.Save:
      case GnroButtonType.Reset:
      case GnroButtonType.View:
        return !this.gridSetting$().gridEditable;
      default:
        return false;
    }
  }

  buttonClick(button: GnroButtonConfg): void {
    switch (button.name) {
      case GnroButtonType.Refresh: // in-memory api not able to refresh since the data are same
        console.log(' refresh grid id =', this.gridId);
        this.gridFacade.refresh(this.gridId);
        /*
        if (this.gridConfig$().virtualScroll) {
          this.gridFacade.getGridPageData(this.gridId, 1);
        } else {
          this.gridFacade.getGridData(this.gridId, this.gridSetting$());
        }
          */
        break;
      case GnroButtonType.ClearAllFilters:
        this.gridFacade.setColumnFilters(this.gridConfig$(), this.gridSetting$(), []);
        break;
      case GnroButtonType.Add:
        if (this.gridConfig().hasDetailView) {
          this.gridFacade.addNewRecord(this.gridId);
        }
        break;
      case GnroButtonType.Delete:
        this.gridFacade.deleteRecords(this.gridId);
        break;
      case GnroButtonType.Edit:
        this.gridFacade.setEditable(this.gridId, true);
        break;
      case GnroButtonType.View:
        this.gridFacade.setEditable(this.gridId, false);
        break;
      case GnroButtonType.Reset:
        this.gridFacade.setResetEdit(this.gridId, true);
        break;
      case GnroButtonType.Save:
        this.gridFacade.saveModifiedRecords(this.gridId);
        break;
      case GnroButtonType.Open:
        this.gridFacade.openButtonClick(this.gridId);
        break;
      case GnroButtonType.Export:
        this.gridFacade.exports(this.gridId);
        break;
      default:
        break;
    }
    if (button.remoteAction) {
      // TODO for undefined button???
      this.gridFacade.buttonRemoteClick(this.gridId, button);
    }
    this.gnroButtonClick.emit({ button, gridConfig: this.gridConfig$(), gridSetting: this.gridSetting$() });
  }

  ngOnDestroy(): void {
    this.gridFacade.clearStore(this.gridId);
    this.tasksService.removeTask(this.gridId);
  }
}
