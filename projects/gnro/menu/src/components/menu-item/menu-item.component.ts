import { ChangeDetectionStrategy, Component, computed, HostListener, input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { defaultCheckboxFieldConfig, GnroCheckboxFieldComponent, GnroCheckboxFieldConfig } from '@gnro/ui/fields';
import { GnroIconModule } from '@gnro/ui/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { GnroMenuConfig } from '../../models/menu-item.model';

@Component({
  selector: 'gnro-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.menu-item-separator]': 'menuItem().separator',
    '[class.selected]': 'menuItem().selected',
    '[class.disabled]': 'disabled()',
    '[style.height]': 'height()',
  },
  imports: [RouterModule, FormsModule, ReactiveFormsModule, GnroCheckboxFieldComponent, TranslatePipe, GnroIconModule],
})
export class GnroMenuItemComponent {
  fieldConfig: GnroCheckboxFieldConfig = { ...defaultCheckboxFieldConfig };
  form = input.required<FormGroup>();
  menuItem = input.required({
    transform: (menuItem: GnroMenuConfig) => {
      this.fieldConfig = {
        ...defaultCheckboxFieldConfig,
        fieldName: menuItem.name,
        fieldLabel: menuItem.title || menuItem.name,
        labelBeforeCheckbox: false,
        editable: !menuItem.disabled,
      };
      return menuItem;
    },
  });
  disabled = input<boolean>(false);
  height = computed(() => (this.menuItem().height ? `${this.menuItem().height}px` : `28px`));
  gnroMenuItemClick = output<GnroMenuConfig>();

  get separator() {
    return this.menuItem().separator;
  }

  get selectedClass(): boolean {
    return !!this.menuItem().selected;
  }

  get title(): string {
    return this.menuItem().title === undefined ? this.menuItem().name : this.menuItem().title!;
  }

  hasChildItem(item: GnroMenuConfig): boolean {
    return !item.hidden && !!item.children && item.children.length > 0;
  }

  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.stopPropagation();
    }
    if (!this.menuItem().checkbox && !this.disabled()) {
      this.gnroMenuItemClick.emit(this.menuItem());
    }
  }
}
