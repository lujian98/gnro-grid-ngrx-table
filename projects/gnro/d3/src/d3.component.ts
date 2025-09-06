import { ChangeDetectionStrategy, Component, OnDestroy, inject, input } from '@angular/core';
import { GnroD3StateModule } from './+state/d3-state.module';
import { uniqueId } from '@gnro/ui/core';
import { GnroD3Facade } from './+state/d3.facade';
import { GnroD3ViewComponent } from './components/d3-view.component';
import { GnroD3ChartConfig } from './models';
import { GnroD3Config, defaultD3Config } from './models/d3.model';

@Component({
  selector: 'gnro-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroD3StateModule, GnroD3ViewComponent],
})
export class GnroD3Component<T> implements OnDestroy {
  private readonly d3Facade = inject(GnroD3Facade);
  private d3Id = `d3-${uniqueId()}`;
  d3Config$ = this.d3Facade.getConfig(this.d3Id);
  d3Setting$ = this.d3Facade.getSetting(this.d3Id);
  chartConfigs$ = this.d3Facade.getChartConfigs(this.d3Id);
  data$ = this.d3Facade.getData(this.d3Id);

  d3Config = input(defaultD3Config, {
    transform: (value: Partial<GnroD3Config>) => {
      const config = { ...defaultD3Config, ...value };
      this.initChartConfigs(config);
      return config;
    },
  });

  chartConfigs = input([], {
    transform: (chartConfigs: GnroD3ChartConfig[]) => {
      if (!this.d3Config().remoteChartConfigs && chartConfigs.length > 0) {
        this.d3Facade.setChartConfigs(this.d3Id, this.d3Config(), [...chartConfigs]);
      }
      return chartConfigs;
    },
  });
  data = input([], {
    transform: (data: T[]) => {
      if (!this.d3Config().remoteD3Data && data) {
        this.d3Facade.setData(this.d3Id, this.d3Config(), data);
      }
      return data;
    },
  });

  constructor() {
    this.initChartConfigs(defaultD3Config);
  }

  private initChartConfigs(d3Config: GnroD3Config): void {
    this.d3Facade.initConfig(this.d3Id, d3Config);
  }

  ngOnDestroy(): void {
    this.d3Facade.clearStore(this.d3Id);
  }
}
