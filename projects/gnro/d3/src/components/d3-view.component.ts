import { isDataSource } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { GnroPopoverService } from '@gnro/ui/popover';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { GnroD3DataSource } from '../d3-data-source';
import { GnroD3Dispatch } from '../dispatch/dispatch';
import { GnroAbstractDraw, GnroAxisDraw, GnroInteractiveDraw, GnroScaleDraw, GnroView, GnroZoomDraw } from '../draws';
import {
  DEFAULT_CHART_OPTIONS,
  GnroD3ChartConfig,
  GnroD3LegendOptions,
  GnroD3Options,
  GnroD3ZoomOptions,
} from '../models';
import { GnroD3Config } from '../models/d3.model';
import { GnroDrawServie } from '../services/draw.service';
import { initChartConfigs } from '../utils/initChartConfigs';
import { GnroD3LegendComponent } from './legend/legend.component';

@Component({
  selector: 'gnro-d3-view',
  templateUrl: './d3-view.component.html',
  styleUrls: ['./d3-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroD3LegendComponent],
  providers: [GnroDrawServie, GnroPopoverService],
})
export class GnroD3ViewComponent<T> implements AfterViewInit, OnInit, OnDestroy {
  private readonly drawServie = inject(GnroDrawServie);
  private options!: GnroD3Options; // get form d3Config
  private zoom!: GnroZoomDraw<T>;
  private interactive!: GnroInteractiveDraw<T>;
  private drawAxis!: GnroAxisDraw<T>;
  private _dataSubscription!: Subscription | null;
  private alive = true;
  private isViewReady = false;
  private isWindowReszie$: Subject<{}> = new Subject();
  dispatch = new GnroD3Dispatch();
  view = new GnroView(DEFAULT_CHART_OPTIONS);
  scale: GnroScaleDraw<T> = new GnroScaleDraw(this.view);
  draws: GnroAbstractDraw<T>[] = [];

  data$ = signal<T[]>([]);
  chartConfigs$ = signal<GnroD3ChartConfig[]>([]);
  chartConfigs = input.required({
    transform: (chartConfigs: GnroD3ChartConfig[]) => {
      const chartConfig = chartConfigs[0];
      this.view.initOptions(this.options, chartConfig);
      this.chartConfigs$.set(initChartConfigs(chartConfigs));
      this._clearDataSource(true);
      this._setDataSource(this.data$());
      return chartConfigs;
    },
  });
  d3Config = input.required({
    transform: (d3Config: GnroD3Config) => {
      if (d3Config.options) {
        this.options = { ...d3Config.options };
      }
      return d3Config;
    },
  });
  data = input([], {
    transform: (data: T[]) => {
      this.data$.set(data);
      this._setDataSource(data);
      return data;
    },
  });
  dataSource = input([], {
    transform: (dataSource: GnroD3DataSource<T[]> | Observable<T[]> | T[]) => {
      this._setDataSource(dataSource);
      return dataSource;
    },
  });

  get legend(): GnroD3LegendOptions {
    return this.chartConfigs$()[0].legend!;
  }

  get zoomConfig(): GnroD3ZoomOptions {
    return this.chartConfigs$()[0].zoom!;
  }

  @HostBinding('style.flex-direction') get flexDirection(): any {
    if (this.legend) {
      switch (this.legend.position) {
        case 'top':
          return 'column-reverse';
        case 'bottom':
          return 'column';
        case 'right':
          return '';
      }
    }
  }

  constructor() {
    this.setDispatch();
  }

  ngOnInit(): void {
    this.isWindowReszie$
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(100),
      )
      .subscribe(() => this.resizeChart(this.data$()));
  }

  ngAfterViewInit(): void {
    this.isViewReady = true;
    if (this.data$()) {
      this.updateChart(this.data$());
    }
  }

  redraw = () => this.draws.forEach((draw: GnroAbstractDraw<T>) => draw.redraw());

  private updateChart(data: T[]): void {
    this.data$.set(this.checkData(data));
    if (this.isViewReady && this.data$()) {
      if (!this.view.svg) {
        this.createChart(this.data$());
      } else {
        this.setDrawDomain(this.data$());
        this.drawChart(this.data$());
        if (this.zoomConfig.enabled) {
          this.zoom.setZoomRange();
        }
        this.interactive.update();
      }
    }
  }

  private resizeChart(data: T[]): void {
    this.view.setViewDimension(this.zoomConfig);
    this.scale.update();
    this.setDrawDomain(data);
    if (this.zoomConfig.enabled) {
      this.zoom.update();
      this.zoom.setZoomRange();
    }
    this.drawChart(data);
    this.interactive.update();
  }

  private createChart(data: T[]): void {
    this.view.setViewDimension(this.zoomConfig);
    this.scale.initColor(data);
    this.view.initView(this.chartConfigs$());
    this.view.update();
    this.scale.buildScales(this.chartConfigs$());
    this.drawAxis = new GnroAxisDraw(this.view, this.scale, this.chartConfigs$());
    this.chartConfigs$().forEach((chart) => {
      const draw = this.drawServie.getDraw(this.view, this.scale, this.dispatch.dispatch, chart);
      this.draws.push(draw);
    });
    this.setDrawDomain(data);
    this.drawChart(data);
    if (this.zoomConfig.enabled) {
      this.zoom = new GnroZoomDraw(this.view, this.scale, this);
    }
    this.interactive = new GnroInteractiveDraw(this.view, this.scale, this);
    this.interactive.drawPanel.select('.drawArea').on('mouseout', (e, d) => this.dispatch.hidePopover());
    this.dispatch.draws = this.draws;
  }

  private drawChart(data: any[]): void {
    this.draws.forEach((draw: GnroAbstractDraw<T>, i: number) => {
      const drawData = data.filter((d: any) => {
        const panelId = d.panelId ? d.panelId : '0';
        const yAxisId = d.yAxisId ? d.yAxisId : 'LEFT';
        return (
          !d.disabled &&
          draw.panelId === panelId &&
          draw.yAxisId === yAxisId &&
          (d.chartType === draw.chartType || (!d.chartType && this.draws[0].chartType === draw.chartType))
        );
      });
      draw.drawChart(drawData);
    });
  }

  private stateChangeDraw(): void {
    this.setDrawDomain(this.data$()); // TODO option to turn on/off set dromain
    if (this.zoomConfig.enabled) {
      this.zoom.setZoomRange();
    }
    this.drawChart(this.data$());
    this.interactive.update();
  }

  private setDrawDomain(data: T[]): void {
    this.scale.setDrawDomain(data);
    this.drawAxis.update();
  }

  private setDispatch(): void {
    this.dispatch.setDispatch();
    this.dispatch.dispatch.on('legendClick', (d: any) => this.stateChangeDraw());
    this.dispatch.dispatch.on('legendResize', (d: any) => this.resizeChart(this.data$()));
  }

  private _setDataSource(dataSource: GnroD3DataSource<T[]> | Observable<T[]> | T[]): void {
    this._clearDataSource();
    let dataStream: Observable<T[] | ReadonlyArray<T[]>> | undefined;
    if (isDataSource(dataSource)) {
      dataStream = dataSource.connect();
    } else if (dataSource instanceof Observable) {
      dataStream = dataSource;
    } else if (Array.isArray(dataSource)) {
      dataStream = of(dataSource);
    }
    if (dataStream) {
      // @ts-ignore
      this._dataSubscription = dataStream.pipe(takeWhile(() => this.alive)).subscribe((data: T[]) => {
        if (data) {
          this.data$.set(data);
          this.updateChart(this.data$());
        }
      });
    }
  }

  private _clearDataSource(clearElemet: boolean = false): void {
    if (this.dataSource() && typeof (this.dataSource() as GnroD3DataSource<T[]>).disconnect === 'function') {
      (this.dataSource() as GnroD3DataSource<T[]>).disconnect();
      clearElemet = true;
    }
    if (clearElemet) {
      this.view.clearElement();
    }
    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
      this._dataSubscription = null;
    }
  }

  private cloneData = <T>(data: T[]) => data && data.map((d) => (typeof d === 'object' ? Object.assign({}, d) : d));

  private checkData<T>(data: T[]): any[] {
    const configs = this.chartConfigs$()[0];
    data = this.cloneData(data);
    return data && configs.chartType === 'pieChart' && !configs.y0!(data[0])
      ? [
          {
            key: 'Pie Chart',
            values: data,
          },
        ]
      : data;
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.isWindowReszie$.complete();
    this._clearDataSource();
    this.view.clearElement();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    this.isWindowReszie$.next(true);
  }
}
