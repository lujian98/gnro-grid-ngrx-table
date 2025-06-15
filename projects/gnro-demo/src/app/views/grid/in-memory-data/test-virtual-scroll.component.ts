import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-test-virtual-scroll',
  templateUrl: './test-virtual-scroll.component.html',
  styleUrls: ['./test-virtual-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ScrollingModule],
})
export class AppTestVirtualScrollComponent {
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
}
