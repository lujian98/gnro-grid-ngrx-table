import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GnroMenuConfig, CdkMenusComponent } from '@gnro/ui/menu';
import { GnroTrigger } from '@gnro/ui/overlay';
import { MockMenuItems } from '../mock-menu';

@Component({
  selector: 'app-simple-menu',
  templateUrl: './simple-menu.component.html',
  styleUrls: ['./simple-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CdkMenusComponent],
})
export class AppSimpleMenuComponent implements OnInit {
  contextmenu: GnroTrigger = GnroTrigger.CONTEXTMENU;

  menuItems: any;
  testMenuItems = MockMenuItems;

  ngOnInit() {
    this.menuItems = [this.testMenuItems];
  }

  menuItemClick(item: GnroMenuConfig): void {
    console.log('gnroMenuItemClick=', item);
  }
}
