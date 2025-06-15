import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'gnro-filter-highlight',
  templateUrl: './filter-highlight.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GnroFilterHighlightComponent<T> {
  value = input.required<string>();
  filterValue = input.required<string>();
  values$ = computed(() => {
    if (this.filterValue() && this.value()) {
      const pattern = this.filterValue()
        .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
        .split(' ')
        .filter((t) => t.length > 0)
        .join('|');
      const regex = new RegExp(pattern, 'gi');
      const marked = this.value().replace(regex, (match) => `<mark>${match}<mark>`);
      return marked.split('<mark>');
    } else {
      return [this.value()];
    }
  });

  isMarkedValue(value: string): boolean {
    return !!value && !!this.filterValue() && value.toLowerCase() === this.filterValue().toLowerCase();
  }
}
