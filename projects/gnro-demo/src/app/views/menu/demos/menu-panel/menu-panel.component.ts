import { CdkMenu, CdkMenuBar, CdkMenuGroup, CdkMenuTrigger, CdkContextMenuTrigger } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IccButtonComponent } from '@icc/ui/button';
import { IccCheckboxComponent } from '@icc/ui/checkbox';
import { IccIconModule } from '@icc/ui/icon';
import { CdkMenusComponent, IccMenuItem, IccMenuConfig } from '@icc/ui/menu';
import { defaultContextMenu } from '@icc/ui/tabs';
import { MockMenuItems } from '../mock-menu';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IccButtonComponent,
    IccIconModule,
    IccCheckboxComponent,
    IccMenuItem,
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

  onMenuItemClick(item: IccMenuConfig): void {
    console.log(' menu item click=', item);
  }
}
