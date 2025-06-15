import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, HostListener } from '@angular/core';
import {
  IccLayoutComponent,
  IccLayoutHeaderComponent,
  IccLayoutFooterComponent,
  IccLayoutCenterComponent,
  IccLayoutHorizontalComponent,
  IccLayoutLeftComponent,
  IccLayoutRightComponent,
} from '@icc/ui/layout';

@Component({
  selector: 'app-accordion-layout',
  templateUrl: './accordion-layout.component.html',
  styleUrls: ['./accordion-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccLayoutComponent, IccLayoutHeaderComponent, IccLayoutHorizontalComponent],
})
export class AppAccordionLayoutComponent {
  private elementRef = inject(ElementRef);
  items = [
    {
      name: 'Card 1',
      title: 'Card 1',
      content: 'test',
    },
    {
      name: 'Card 1',
      title: 'Card 2',
      content: 'test',
      expanded: true,
    },
    {
      name: 'Card 1',
      title: 'Card 3',
      content: 'test',
    },
    {
      name: 'Card 1',
      title: 'Card 4',
      content: 'test',
    },
    {
      name: 'Card 1',
      title: 'Card 5',
      content: 'test',
    },
    {
      name: 'Card 1',
      title: 'Card 6',
      content: 'test',
    },
    {
      name: 'Card 1',
      title: 'Card 7',
      content: 'test',
    },
    {
      name: 'Card 1',
      title: 'Card 8',
      content: 'test',
    },
  ];

  getLayoutFlex(item: any): string {
    return item?.expanded ? '1 1 auto' : '0 0 30px';
  }

  ngAfterViewInit(): void {
    this.setupView();
  }

  private setupView(): void {
    const scrollHeight = this.elementRef.nativeElement.scrollHeight;
    const clientHeight = this.elementRef.nativeElement.clientHeight;
    const dh = scrollHeight - clientHeight;
    const children: HTMLDivElement[] = Array.from(this.elementRef.nativeElement.children);
    const expanded = children.find((el) => el.children.length === 2);
    const expandedChild = expanded?.children[1] as HTMLDivElement;
    const style = window.getComputedStyle(expandedChild!);
    if (dh > 0) {
      const height = parseFloat(style.height) - dh;
      expandedChild!.style.setProperty('flex', `0 0 ${height}px`);
    } else {
      expandedChild!.style.setProperty('flex', `0 0 auto`);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: MouseEvent): void {
    this.setupView();
  }
}
