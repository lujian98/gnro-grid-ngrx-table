import { CdkMenu, CdkMenuBar, CdkMenuGroup, CdkMenuTrigger, CdkContextMenuTrigger } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroCheckboxComponent } from '@gnro/ui/checkbox';
import { GnroIconModule } from '@gnro/ui/icon';
import { CdkMenusComponent, GnroMenuItem, GnroMenuConfig } from '@gnro/ui/menu';
import { defaultContextMenu } from '@gnro/ui/tabs';
import { MockMenuItems } from '../mock-menu';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GnroButtonComponent,
    GnroIconModule,
    GnroCheckboxComponent,
    GnroMenuItem,
    CdkMenuGroup,
    CdkMenu,
    CdkContextMenuTrigger,
    CdkMenuTrigger,
    CdkMenuBar,
    CdkMenusComponent,
  ],
})
export class AppMenuPanelComponent {
  defaultContextMenu = defaultContextMenu;
  menuItems = MockMenuItems.children!;

  onMenuItemClick(item: GnroMenuConfig): void {
    console.log(' menu item click=', item);
  }
}
