import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GnroDisabled } from '@gnro/ui/core';
import { GnroIconModule } from '@gnro/ui/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GnroMenuItemComponent } from './components/menu-item/menu-item.component';
import { GnroMenuItem } from './directive/menu-item';
import { GnroMenuConfig } from './models/menu-item.model';

//WARNING: cdk menus not works with grid column hide/show due to the point menu without element reference
@Component({
  selector: 'cdk-menus',
  templateUrl: './cdk-menus.component.html',
  styleUrls: ['./cdk-menus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CdkMenu,
    GnroIconModule,
    CdkMenuTrigger,
    GnroMenuItem,
    GnroMenuItemComponent,
  ],
})
export class CdkMenusComponent<T> {
  private readonly destroyRef = inject(DestroyRef);
  private selected: GnroMenuConfig | undefined;
  private isFirstTime: boolean = true;
  items$ = signal<GnroMenuConfig[]>([]);
  values$ = signal<{ [key: string]: boolean }>({});
  form = input(new FormGroup({}), { transform: (form: FormGroup) => form });
  disabled = input<GnroDisabled[]>([]);
  level = input<number>(0);
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
