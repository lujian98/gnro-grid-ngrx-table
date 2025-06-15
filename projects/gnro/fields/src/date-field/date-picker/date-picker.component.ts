import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { GnroButtonComponent } from '@gnro/ui/button';
import { GnroCalendarComponent, GnroCalendarConfig, GnroPickerOverlayAnimations } from '@gnro/ui/calendar';
import {
  GnroLayoutComponent,
  GnroLayoutFooterComponent,
  GnroLayoutFooterEndComponent,
  GnroLayoutFooterStartComponent,
} from '@gnro/ui/layout';
import { TranslateDirective, TranslateService } from '@ngx-translate/core';
import { GnroSelectFieldComponent } from '../../select-field/select-field.component';
import {
  GnroDateFieldConfig,
  GnroDatePresetItem,
  defaultDateFieldConfig,
  gnroDefaultDatePresets,
  presetDateSelectionConfig,
} from '../models/date-field.model';
import { GnroDateStoreService } from '../services/date-store.service';

@Component({
  selector: 'gnro-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GnroPickerOverlayAnimations.transformPanel],
  imports: [
    GnroButtonComponent,
    TranslateDirective,
    GnroCalendarComponent,
    GnroLayoutComponent,
    GnroLayoutFooterComponent,
    GnroLayoutFooterEndComponent,
    GnroLayoutFooterStartComponent,
    GnroSelectFieldComponent,
  ],
})
export class GnroDatePickerComponent implements OnInit {
  private readonly overlayRef = inject(OverlayRef);
  private readonly translateService = inject(TranslateService);
  private readonly dateStoreService = inject(GnroDateStoreService);
  private readonly adapter = inject(DateAdapter<Date>);
  private _fieldConfig!: GnroDateFieldConfig;

  calendarConfig!: Partial<GnroCalendarConfig>;
  selectedDate!: Date | null;
  shouldAnimate: string = 'enter'; //  'enter' : 'noop';

  set fieldConfig(fieldConfig: GnroDateFieldConfig) {
    this._fieldConfig = fieldConfig;
    this._fieldConfig = { ...defaultDateFieldConfig, ...fieldConfig };
    this.calendarConfig = {
      selectedLabel: this.fieldConfig.selectedLabel,
      dateFormat: this.fieldConfig.dateFormat,
      excludeWeekends: this.fieldConfig.excludeWeekends,
      minDate: this.fieldConfig.minDate,
      maxDate: this.fieldConfig.maxDate,
    };
  }
  get fieldConfig(): GnroDateFieldConfig {
    return this._fieldConfig;
  }
  field: FormControl | null = null;

  presetSelectionConfig = presetDateSelectionConfig;
  presets: GnroDatePresetItem[] = [];

  ngOnInit(): void {
    this.adapter.setLocale(this.translateService.currentLang);
    this.selectedDate = this.field ? this.field.value : this.dateStoreService.selectedDate;

    this.presets = [...gnroDefaultDatePresets].map((item) => {
      return {
        label: this.translateService.instant(item.label),
        date: item.date,
      };
    });
  }

  updateSelectedDate(date: Date | null): void {
    this.selectedDate = date;
  }

  updateSelectDateByPreset(item: GnroDatePresetItem): void {
    this.updateSelectedDate(item.date ? item.date : null);
  }

  applyNewDates(e: MouseEvent): void {
    this.dateStoreService.updateSelected(this.selectedDate!);
    this.disposeOverLay();
  }

  discardNewDates(e: MouseEvent): void {
    this.disposeOverLay();
  }

  clearSelectedDates(e: MouseEvent): void {
    this.dateStoreService.clearSelected();
    this.disposeOverLay();
  }

  private disposeOverLay(): void {
    this.overlayRef.dispose();
  }
}
