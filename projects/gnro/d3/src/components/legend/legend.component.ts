import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostBinding,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as d3Dispatch from 'd3-dispatch';
import * as d3 from 'd3-selection';
import { Subject } from 'rxjs';
import { delay, takeWhile } from 'rxjs/operators';
import { GnroScaleDraw, GnroView } from '../../draws';
import { GnroD3ChartConfig } from '../../models';

@Component({
  selector: 'gnro-d3-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.style]': 'style',
  },
})
export class GnroD3LegendComponent<T> implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  view = input.required({
    transform: (view: GnroView) => {
      if (this.availableWidth !== view.width - view.margin.left!) {
        this.availableWidth = view.width - view.margin.left!;
      }
      return view;
    },
  });
  chartConfigs = input<GnroD3ChartConfig[]>([]);
  data = input<T[]>([]);
  scale = input<GnroScaleDraw<T> | null>(null);
  dispatch = input<d3Dispatch.Dispatch<{}>>();
  legendData$ = computed(() => {
    const legendData: any[] = [];
    const data = this.getData();
    if (data && this.view()) {
      if (this.legend.position !== 'right') {
        const seriesPerRow = this.getSeriesPerRow();
        let nd: any[] = [];
        data.forEach((d, i) => {
          if (i !== 0 && i % seriesPerRow === 0) {
            legendData.push(nd);
            nd = [];
          }
          nd.push(d);
        });
        legendData.push(nd);
      } else {
        legendData.push(data);
      }
      this.stateChange$.next(true);
    }
    return legendData;
  });

  private alive = true;
  stateChange$ = new Subject<boolean>();
  availableWidth = 0;
  columnWidths = [];

  @HostBinding('style.display') get display(): string {
    // @ts-ignore
    return (this.getData() && this.columnWidths.length === this.getData().length) || this.legend.position === 'right'
      ? 'flex'
      : null;
  }

  @HostBinding('style.align-items') get alignItems(): string {
    return this.legend.position === 'right' ? this.legend.align : null;
  }

  get configs(): GnroD3ChartConfig {
    // TODO other charts if need only for X axis for now
    return this.chartConfigs()[0];
  }

  get legend(): any {
    return this.configs.legend;
  }

  ngOnInit(): void {
    this.stateChange$
      .pipe(
        takeWhile(() => this.alive),
        delay(0),
      )
      .subscribe(() => {
        this.dispatch()!.call('legendResize', this, this.getData());
      });
  }

  private getData(): T[] {
    return this.configs.chartType === 'pieChart' ? this.configs.y0!(this.data()[0]) : this.data();
  }

  private getSeriesPerRow(): number {
    let seriesPerRow = 0;
    this.columnWidths = [];
    const legendText = d3.select(this.elementRef.nativeElement).selectAll('.legend');
    const seriesWidths: any[] = [];
    legendText.nodes().forEach((d: any, i) => seriesWidths.push(d.getBoundingClientRect().width));
    let legendWidth = 0;
    while (legendWidth < this.availableWidth && seriesPerRow < seriesWidths.length) {
      // @ts-ignore
      this.columnWidths[seriesPerRow] = seriesWidths[seriesPerRow];
      legendWidth += seriesWidths[seriesPerRow++];
    }
    if (seriesPerRow === 0) {
      seriesPerRow = 1;
    }
    while (legendWidth > this.availableWidth && seriesPerRow > 1) {
      this.columnWidths = [];
      seriesPerRow--;
      for (let k = 0; k < seriesWidths.length; k++) {
        if (seriesWidths[k] > (this.columnWidths[k % seriesPerRow] || 0)) {
          // @ts-ignore
          this.columnWidths[k % seriesPerRow] = seriesWidths[k];
        }
      }
      // @ts-ignore
      legendWidth = this.columnWidths.reduce((prev, cur, index, array) => prev + cur);
    }
    return seriesPerRow;
  }

  legendWidth(i: number): any {
    if (this.columnWidths.length > 0 && this.columnWidths.length !== this.getData().length) {
      return `${this.columnWidths[i]}px`;
    }
  }

  legendStyles(): {} {
    const right = 10 + this.view().margin.right! + (this.configs.zoom!.verticalBrushShow ? 80 : 0);
    let marginRight = `${right}px`;
    let marginLeft = `${this.view().margin.left}px`;
    if (this.legend.align === 'right' && this.columnWidths.length === this.getData().length) {
      marginLeft = 'auto';
    } else if (this.legend.position === 'right') {
      marginLeft = 'auto';
    }
    if (this.legend.align !== 'right' || this.legend.position === 'right') {
      marginRight = 'auto';
    }
    return {
      display: this.legend.position !== 'right' ? 'flex' : null,
      'margin-right': marginRight,
      'margin-left': marginLeft,
    };
  }

  legendText(d: T): string {
    return d && this.configs.chartType === 'pieChart' ? this.configs.x!(d) : this.configs.x0!(d);
  }

  legendColor(d: any, i: number): any {
    if (d && this.scale()?.colors) {
      return d.color || this.scale()!.colors(this.configs.drawColor!(d, i));
    }
  }

  iconStyles(d: any, i: number): {} {
    const color = this.legendColor(d, i);
    return {
      'background-color': !d.disabled ? color : null,
      'border-color': color,
    };
  }

  itemClick(event: any, d: any): void {
    d.disabled = !d.disabled;
    this.dispatch()!.call('legendClick', this, d);
  }

  itemMouseOver(event: any, d: T): void {
    this.dispatch()!.call('legendMouseover', this, d);
  }

  itemMouseOut(event: any, d: T): void {
    this.dispatch()!.call('legendMouseout', this, d);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
