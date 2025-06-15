import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IccButtonComponent } from '@icc/ui/button';
import { IccLayoutComponent, IccLayoutHeaderComponent } from '@icc/ui/layout';
import { IccTabsComponent, IccTabsConfig, IccTabConfig } from '@icc/ui/tabs';
import { take } from 'rxjs';
import { AppForm1Component } from './form1.component';
import { AppForm2Component } from './form2.component';
import { AppForm3Component } from './form3.component';
import { TabsMockService } from './tabs-mock.service';

@Component({
  selector: 'app-tab-form',
  template: `
    <icc-layout>
      <icc-layout-header>
        <button icc-button (click)="loadValues()">Load Values</button>
        <button icc-button (click)="checkForm()">Check Form</button>
      </icc-layout-header>
      <icc-tabs [tabsConfig]="tabsConfig" [tabs]="tabs"> </icc-tabs>
    </icc-layout>
  `,
  styles: [':host {  display: flex; flex-direction: column; width: 475px; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IccButtonComponent,
    IccLayoutComponent,
    IccLayoutHeaderComponent,
    FormsModule,
    IccTabsComponent,
  ],
})
export class AppTabFormComponent {
  private tabsMockService = inject(TabsMockService);

  form: FormGroup = new FormGroup({
    fieldA: new FormControl('field A'),
    fieldTest3: new FormControl('Form Panel 3'),
  });

  tabsConfig: Partial<IccTabsConfig> = {
    enableContextMenu: true,
  };

  options = [];
  tabs: IccTabConfig[] = [
    {
      name: 'tab1',
      title: 'Form Panel 1',
      content: AppForm1Component,
      context: {
        form: this.form,
        values: ['test1', 'test2', 'test3'],
      },
    },
    {
      name: 'tab2',
      title: 'Form Panel 2',
      content: AppForm2Component,
      context: {
        form: this.form,
      },
    },
    {
      name: 'tab3',
      title: 'Form Panel 3',
      content: AppForm3Component,
      context: {
        form: this.form,
      },
    },
    {
      name: 'six',
      content: 'test 6',
      closeable: true,
    },
    {
      name: 'seven',
      content: 'test 7',
      closeable: true,
    },
  ];

  loadValues(): void {
    this.tabsMockService
      .getTabsMockData()
      .pipe(take(1))
      .subscribe((values) => {
        this.setTabContextValues(values);
      });
  }

  private setTabContextValues(values: string[][]): void {
    this.tabs = [...this.tabs].map((tab, index) => {
      if (index < 3) {
        return {
          ...tab,
          context: {
            ...tab.context,
            values: values[index],
          },
        };
      }
      return { ...tab };
    });
  }

  checkForm(): void {
    const values = this.form.value;
    console.log(' check form values =', values);
  }
}
