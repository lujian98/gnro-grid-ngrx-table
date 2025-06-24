import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroDisabled } from '@gnro/ui/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { GnroPosition, GnroTrigger } from '@gnro/ui/overlay';
import { GnroPopoverDirective } from '@gnro/ui/popover';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GnroMenuItemComponent } from './components/menu-item/menu-item.component';
import { GnroMenuConfig } from './models/menu-item.model';

@Component({
  selector: 'gnro-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, GnroIconModule, GnroMenuItemComponent, GnroPopoverDirective],
})
export class GnroMenusComponent<T> {
  private readonly destroyRef = inject(DestroyRef);
  private selected: GnroMenuConfig | undefined;
  private isFirstTime: boolean = true;
  bottom = GnroPosition.BOTTOM;
  rightBottom = GnroPosition.RIGHTBOTTOM;
  hoverTrigger = GnroTrigger.HOVER;
  items$ = signal<GnroMenuConfig[]>([]);
  values$ = signal<{ [key: string]: boolean }>({});
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  disabled = input<GnroDisabled[]>([]);
  level = input<number>(0);
  clickToClose = input<boolean>(false);
  menuTrigger = input<GnroTrigger>(GnroTrigger.CLICK);
  items = input([], {
    transform: (items: GnroMenuConfig[]) => {
      this.items$.set(items);
      this.setSelected(this.selected);
      if (this.isFirstTime) {
        this.form()
          .valueChanges.pipe(debounceTime(100), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
          .subscribe((val) => {
            this.gnroMenuFormChanges.emit(this.form().value as T);
            this.values$.set(this.form().value);
          });
        this.isFirstTime = false;
      }
      items.forEach((item) => {
        const field = this.form().get(item.name);
        if (item.checkbox && !field) {
          this.form().addControl(item.name, new FormControl<boolean>({ value: false, disabled: false }, []));
        }
      });
      return items;
    },
  });
  values = input(
    {},
    {
      transform: (values: { [key: string]: boolean }) => {
        this.values$.set(values);
        if (this.form && values) {
          this.form().patchValue({ ...values }, { emitEvent: false });
        }
        return values;
      },
    },
  );

  gnroMenuItemClick = output<GnroMenuConfig>();
  gnroMenuFormChanges = output<T>();

  getDisabled(menu: GnroMenuConfig): boolean {
    const find = this.disabled().find((item) => item.name === menu.name);
    return find ? find.disabled : false;
  }

  menuItemClick(item: GnroMenuConfig): void {
    if (!item.checkbox) {
      this.gnroMenuItemClick.emit(item);
    }
    this.setSelected(item);
  }

  isLeafMenu(item: GnroMenuConfig): boolean {
    return !item.hidden && (!item.children || item.children.length === 0);
  }

  hasChildItem(item: GnroMenuConfig): boolean {
    return !item.hidden && !!item.children && item.children.length > 0;
  }

  private setSelected(selected: GnroMenuConfig | undefined): void {
    if (selected) {
      const items = this.items$().map((item) => ({
        ...item,
        selected: item.name === selected.name,
      }));
      this.items$.set(items);
    }
    this.selected = selected;
  }
}
