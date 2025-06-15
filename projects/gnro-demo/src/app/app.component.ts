import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IccI18nService, IccLanguage, IccButtonConfg, IccTasksService } from '@icc/ui/core';
import { IccSelectFieldComponent } from '@icc/ui/fields';
import { IccButtonComponent } from '@icc/ui/button';

import {
  IccLayoutComponent,
  IccLayoutHeaderComponent,
  IccLayoutHeaderEndComponent,
  IccLayoutFooterComponent,
} from '@icc/ui/layout';

import { IccThemeService } from '@icc/ui/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    IccSelectFieldComponent,
    IccLayoutComponent,
    IccLayoutHeaderComponent,
    IccLayoutHeaderEndComponent,
    IccLayoutFooterComponent,
    IccButtonComponent,
  ],
})
export class AppComponent implements OnInit {
  themeService = inject(IccThemeService);
  private tasksService = inject(IccTasksService);
  title = 'ICC Demo';

  buttons: IccButtonConfg[] = [
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
  ];

  rangeValue = this.themeService.rangeMax;

  i18nService = inject(IccI18nService);
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

  setLang(selected: IccLanguage): void {
    this.i18nService.setLang(selected);
  }
}
