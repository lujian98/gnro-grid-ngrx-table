import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostBinding,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GnroPopoverService } from '@gnro/ui/popover';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GnroD3Dispatch } from '../dispatch/dispatch';
import { GnroAbstractDraw, GnroAxisDraw, GnroInteractiveDraw, GnroScaleDraw, GnroView, GnroZoomDraw } from '../draws';
import { DEFAULT_CHART_OPTIONS, GnroD3ChartConfig } from '../models';
import { GnroD3Config } from '../models/d3.model';
import { GnroDrawServie } from '../services/draw.service';
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
  private readonly destroyRef = inject(DestroyRef);
  private zoom!: GnroZoomDraw<T>;
  private interactive!: GnroInteractiveDraw<T>;
  private drawAxis!: GnroAxisDraw<T>;
  private isViewReady = false;
  private isWindowReszie$: Subject<{}> = new Subject();
  dispatch = new GnroD3Dispatch();
  view = new GnroView(DEFAULT_CHART_OPTIONS);
  scale: GnroScaleDraw<T> = new GnroScaleDraw(this.view);
  draws: GnroAbstractDraw<T>[] = [];

  d3Config = input.required<GnroD3Config>();
  chartConfigs = input.required({
    transform: (chartConfigs: GnroD3ChartConfig[]) => {
      const chartConfig = chartConfigs[0];
      this.view.initOptions(this.d3Config().options!, chartConfig);
      this.view.clearElement();
      this.updateChart(this.data(), chartConfigs);
      return chartConfigs;
    },
  });
  data = input([], {
    transform: (data: T[]) => {
      this.updateChart(data, this.chartConfigs());
      return data;
    },
  });
  legend = computed(() => this.chartConfigs()[0].legend!);
  zoomConfig = computed(() => this.chartConfigs()[0].zoom!);

  @HostBinding('style.flex-direction') get flexDirection(): string {
    if (this.legend()) {
      switch (this.legend().position) {
        case 'top':
          return 'column-reverse';
        case 'bottom':
          return 'column';
        case 'right':
          return '';
      }
    }
    return '';
  }

  ngOnInit(): void {
    this.setDispatch();
    this.isWindowReszie$
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resizeChart(this.data()));
  }

  ngAfterViewInit(): void {
    this.isViewReady = true;
    if (this.data()) {
      this.updateChart(this.data(), this.chartConfigs());
    }
  }

  redraw = () => this.draws.forEach((draw: GnroAbstractDraw<T>) => draw.redraw());

  private updateChart(data: T[], chartConfigs: GnroD3ChartConfig[]): void {
    if (this.isViewReady && data) {
      if (!this.view.svg) {
        this.createChart(data, chartConfigs);
      } else {
        this.setDrawDomain(data);
        this.drawChart(data);
        if (this.zoomConfig().enabled) {
          this.zoom.setZoomRange();
        }
        this.interactive.update();
      }
    }
  }

  private resizeChart(data: T[]): void {
    this.view.setViewDimension(this.zoomConfig());
    this.scale.update();
    this.setDrawDomain(data);
    if (this.zoomConfig().enabled) {
      this.zoom.update();
      this.zoom.setZoomRange();
    }
    this.drawChart(data);
    this.interactive.update();
  }

  private createChart(data: T[], chartConfigs: GnroD3ChartConfig[]): void {
    this.view.setViewDimension(this.zoomConfig());
    this.scale.initColor(data);
    this.view.initView(chartConfigs);
    this.view.update();
    this.scale.buildScales(chartConfigs);
    this.drawAxis = new GnroAxisDraw(this.view, this.scale, chartConfigs);
    chartConfigs.forEach((chart) => {
      const draw = this.drawServie.getDraw(this.view, this.scale, this.dispatch.dispatch, chart);
      this.draws.push(draw);
    });
    this.setDrawDomain(data);
    this.drawChart(data);
    if (this.zoomConfig().enabled) {
      this.zoom = new GnroZoomDraw(this.view, this.scale, this);
    }
    this.interactive = new GnroInteractiveDraw(this.view, this.scale, this);
    this.interactive.drawPanel.select('.drawArea').on('mouseout', (e, d) => this.dispatch.hidePopover());
    this.dispatch.draws = this.draws;
  }

  private drawChart(data: T[]): void {
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
    this.setDrawDomain(this.data()); // TODO option to turn on/off set dromain
    if (this.zoomConfig().enabled) {
      this.zoom.setZoomRange();
    }
    this.drawChart(this.data());
    this.interactive.update();
  }

  private setDrawDomain(data: T[]): void {
    this.scale.setDrawDomain(data);
    this.drawAxis.update();
  }

  private setDispatch(): void {
    this.dispatch.setDispatch();
    this.dispatch.dispatch.on('legendClick', () => this.stateChangeDraw());
    this.dispatch.dispatch.on('legendResize', () => this.resizeChart(this.data()));
  }

  ngOnDestroy(): void {
    this.view.clearElement();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    this.isWindowReszie$.next(true);
  }
}
