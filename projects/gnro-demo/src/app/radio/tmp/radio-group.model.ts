import { InjectionToken, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GnroRadioGroupDirective } from './radio-group.directive';

export const GNRO_RADIO_GROUP = new InjectionToken<GnroRadioGroupDirective>('GnroRadioGroup');

export const GNRO_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GnroRadioGroupDirective),
  multi: true,
};
