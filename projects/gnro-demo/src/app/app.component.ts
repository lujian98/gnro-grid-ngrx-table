import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GnroI18nService, GnroLanguage, GnroButtonConfg, GnroTasksService } from '@gnro/ui/core';
import { GnroSelectFieldComponent } from '@gnro/ui/fields';
import { GnroButtonComponent } from '@gnro/ui/button';

import {
  GnroLayoutComponent,
  GnroLayoutHeaderComponent,
  GnroLayoutHeaderEndComponent,
  GnroLayoutFooterComponent,
} from '@gnro/ui/layout';

import { GnroThemeService } from '@gnro/ui/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    GnroSelectFieldComponent,
    GnroLayoutComponent,
    GnroLayoutHeaderComponent,
    GnroLayoutHeaderEndComponent,
    GnroLayoutFooterComponent,
    GnroButtonComponent,
  ],
})
export class AppComponent implements OnInit {
  themeService = inject(GnroThemeService);
  private tasksService = inject(GnroTasksService);
  title = 'GNRO Demo';

  buttons: GnroButtonConfg[] = [
    { name: 'Dashboard', link: 'dashboard' },
    { name: 'Grid', link: 'grid' },
    { name: 'Tree', link: 'tree' },
    { name: 'Form', link: 'form' },
    { name: 'Select', link: 'select' },
    { name: 'Menu', link: 'menu' },
    { name: 'Date', link: 'date' },
    { name: 'Tabs', link: 'tabs' },
    { name: 'D3', link: 'd3' },
    { name: 'Layout', link: 'layout' },
    { name: 'Window', link: 'window' },
    { name: 'State', link: 'state' },
  ];

  rangeValue = this.themeService.rangeMax;

  i18nService = inject(GnroI18nService);
  langSelectionConfig = {
    fieldName: 'language',
    optionLabel: 'name',
    optionKey: 'isocode',
    clearValue: false,
  };

  ngOnInit(): void {
    this.i18nService.currentLang = 'en-US';
  }

  toggleTheme(): void {
    this.themeService.changeTheme(this.themeService.currentTheme === 'light' ? 'dark' : 'light');
    this.rangeValue = this.themeService.rangeMax;
  }

  onChange(event: any): void {
    const value: number = event.target.value;
    this.themeService.setBackgroundColor(value);
  }

  setLang(selected: GnroLanguage): void {
    this.i18nService.setLang(selected);
  }
}
