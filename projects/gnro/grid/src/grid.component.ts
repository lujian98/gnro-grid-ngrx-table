import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { GnroButtonConfg, GnroBUTTONS, GnroButtonType, GnroTasksService } from '@gnro/ui/core';
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
  private gridId = `grid-${crypto.randomUUID()}`;
  gridConfig$ = this.gridFacade.getGridConfig(this.gridId);
  gridSetting$ = this.gridFacade.getSetting(this.gridId);
  columnsConfig$ = this.gridFacade.getColumnsConfig(this.gridId);
  gridData$ = this.gridFacade.getGridSignalData(this.gridId);
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
      //if (!this.gridConfig) {
      //  this.initGridConfig({ ...defaultGridConfig });
      //}
      if (!this.gridConfig$().remoteColumnsConfig && columnsConfig.length > 0) {
        const gridSetting = { ...defaultGridSetting, gridId: this.gridId };
        this.gridFacade.setGridColumnsConfig(this.gridConfig$(), gridSetting, columnsConfig);
      }
      return columnsConfig;
    },
  });
  gridData = input(undefined, {
    transform: (gridData: GnroGridData<T>) => {
      if (!this.gridConfig$().remoteGridData && gridData) {
        this.gridFacade.setGridInMemoryData(this.gridId, this.gridConfig$(), gridData as GnroGridData<object>);
      }
      return gridData;
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

  constructor() {
    this.initGridConfig({ ...defaultGridConfig });
  }

  ngOnInit(): void {
    this.tasksService.loadTaskService(this.gridId, GnroGridFacade, this.gridConfig());
  }

  private initGridConfig(config: GnroGridConfig): void {
    this.gridFacade.initGridConfig(this.gridId, config, 'grid');
  }

  private getDisabled(button: GnroButtonConfg): boolean {
    switch (button.name) {
      case GnroButtonType.Save:
      case GnroButtonType.Reset:
        return !this.gridSetting$().recordModified;
      case GnroButtonType.Open:
        return !(this.gridConfig().hasDetailView && this.gridSetting$().selected === 1);
      default:
        return false;
    }
  }

  private getHidden(button: GnroButtonConfg): boolean {
    switch (button.name) {
      case GnroButtonType.Edit:
      case GnroButtonType.Open:
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
        if (this.gridConfig$().virtualScroll) {
          this.gridFacade.getGridPageData(this.gridId, 1);
        } else {
          this.gridFacade.getGridData(this.gridId, this.gridSetting$());
        }
        break;
      case GnroButtonType.ClearAllFilters:
        this.gridFacade.setGridColumnFilters(this.gridConfig$(), this.gridSetting$(), []);
        break;
      case GnroButtonType.Edit:
        this.gridFacade.setGridEditable(this.gridId, true);
        break;
      case GnroButtonType.View:
        this.gridFacade.setGridEditable(this.gridId, false);
        break;
      case GnroButtonType.Reset:
        this.gridFacade.setGridRestEdit(this.gridId, true);
        break;
      case GnroButtonType.Save:
        this.gridFacade.saveGridModifiedRecords(this.gridId);
        break;
      case GnroButtonType.Open:
        this.gridFacade.openButtonClick(this.gridId);
        break;
      default:
        break;
    }
    this.gnroButtonClick.emit({ button, gridConfig: this.gridConfig$(), gridSetting: this.gridSetting$() });
  }

  ngOnDestroy(): void {
    this.gridFacade.clearGridDataStore(this.gridId);
    this.tasksService.removeTask(this.gridId);
  }
}
