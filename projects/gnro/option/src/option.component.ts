import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output } from '@angular/core';

@Component({
  selector: 'gnro-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[class.selected]': 'selected',
    '[style.height]': 'height() + "px"',
  },
})
export class GnroOptionComponent<T> {
  readonly elementRef = inject(ElementRef);
  selected: boolean = false;

  value = input<T>();
  height = input.required<number>();
  change = output<GnroOptionComponent<T>>();

  get content() {
    return this.elementRef.nativeElement.textContent;
  }

  select(): void {
    this.setSelection(true);
  }

  deselect(): void {
    this.setSelection(false);
  }

  private setSelection(selected: boolean): void {
    if (this.selected !== selected) {
      this.selected = selected;
      this.change.emit(this);
    }
  }
}
