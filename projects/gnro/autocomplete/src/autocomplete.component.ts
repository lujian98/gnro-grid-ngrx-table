import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ContentChild, inject, input, TemplateRef, ViewChild } from '@angular/core';
import { GnroOptionComponent } from '@gnro/ui/option';
import { GnroOverlayModule } from '@gnro/ui/overlay';
import { GnroAutocompleteContentDirective } from './autocomplete-content.directive';

@Component({
  selector: 'gnro-autocomplete',
  templateUrl: './autocomplete.component.html',
  exportAs: 'gnroAutocomplete',
  styleUrls: ['./autocomplete.component.scss'],
  imports: [CommonModule, GnroOverlayModule],
})
export class GnroAutocompleteComponent<T, G> {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _selection = new SelectionModel<GnroOptionComponent<T>>(false, []);
  private _value: T | null = null;
  displayWith = input<(value: T) => string>();
  compareWith = input<(value: T, option: T) => boolean>();
  multiSelection = input(false, {
    transform: (multiSelection: boolean) => {
      this.selection = new SelectionModel<GnroOptionComponent<T>>(multiSelection, []);
      return multiSelection;
    },
  });

  get selection(): SelectionModel<GnroOptionComponent<T>> {
    return this._selection;
  }
  set selection(selection: SelectionModel<GnroOptionComponent<T>>) {
    this._selection = selection;
  }

  get value(): T | null {
    return this._value;
  }
  set value(val: T | null) {
    this._value = val;
  }

  get toDisplay(): string {
    if (this.displayWith()) {
      return this.displayWith()!(this.value!);
    } else if (
      this.multiSelection() &&
      Array.isArray(this.value) &&
      this.value.every((i) => typeof i === 'string' || typeof i === 'number')
    ) {
      return this.value.sort((a, b) => a.localeCompare(b)).join(', ');
    } else if (this.selection.selected && this.selection.selected.length > 0) {
      return this.selection.selected
        .map((selected) => selected.content)
        .sort((a, b) => a.localeCompare(b))
        .join(', ');
    } else {
      return this.value ? (this.value as string) : '';
    }
  }

  @ViewChild('root', { static: true }) rootTemplate!: TemplateRef<G>;
  @ContentChild(GnroAutocompleteContentDirective, { static: true }) content!: GnroAutocompleteContentDirective<G>;

  setSelectionOption(option: GnroOptionComponent<T>): void {
    if (this.multiSelection() && Array.isArray(this.value)) {
      const find = this.value.findIndex((item: T) => this.compareValue(option.value()!, item));
      if (find > -1) {
        option.deselect();
        const selected = this.selection.selected.find((item) => this.compareValue(option.value()!, item.value()!));
        if (selected) {
          this.selection.deselect(selected);
        }
        this.value.splice(find, 1);
      } else {
        option.select();
        this.selection.select(option);
        this.value.push(option.value());
      }
    } else {
      this.selection.clear();
      option.select();
      this.selection.select(option);
      this.value = option.value()!;
    }
    this.changeDetectorRef.markForCheck();
  }

  private compareValue(value: T, item: T): boolean {
    return this.compareWith() ? this.compareWith()!(value, item) : value === item;
  }
}
