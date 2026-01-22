import { ChangeDetectionStrategy, Component, computed, OnDestroy, inject, input } from '@angular/core';
import { GnroD3StateModule } from './+state/d3-state.module';
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

  d3Config = input(defaultD3Config, {
    transform: (value: Partial<GnroD3Config>) => {
      const config = { ...defaultD3Config, ...value };
      this.initD3Config(config);
      return config;
    },
  });

  chartConfigs = input([], {
    transform: (chartConfigs: GnroD3ChartConfig[]) => {
      if (!this.d3Config().remoteChartConfigs && chartConfigs.length > 0) {
        this.d3Facade.setChartConfigs(this.d3Config().d3ChartName, this.d3Config(), [...chartConfigs]);
      }
      return chartConfigs;
    },
  });

  data = input([], {
    transform: (data: T[]) => {
      if (!this.d3Config().remoteD3Data && data) {
        this.d3Facade.setData(this.d3Config().d3ChartName, this.d3Config(), data);
      }
      return data;
    },
  });

  d3Config$ = computed(() => this.d3Facade.getConfig(this.d3Config().d3ChartName)());
  chartConfigs$ = computed(() => this.d3Facade.getChartConfigs(this.d3Config().d3ChartName)());
  data$ = computed(() => this.d3Facade.getData(this.d3Config().d3ChartName)());

  private initD3Config(config: GnroD3Config): void {
    this.d3Facade.initConfig(config.d3ChartName, config);
  }

  ngOnDestroy(): void {
    this.d3Facade.clearStore(this.d3Config().d3ChartName);
  }
}
