import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroFormField } from '@gnro/ui/fields';
import { GnroFormConfig } from '@gnro/ui/form';
import { GnroDialogRef } from '@gnro/ui/overlay';
import { GnroWindowComponent, GnroWindowConfig } from '@gnro/ui/window';
import { GnroFormPanelComponent } from './form-panel.component';

@Component({
  selector: 'gnro-form-window',
  templateUrl: './form-window.component.html',
  styleUrls: ['./form-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GnroWindowComponent, GnroFormPanelComponent],
})
export class GnroFormWindowComponent {
  private readonly dialogRef = inject(GnroDialogRef<GnroFormWindowComponent>);

  windowConfig!: GnroWindowConfig;
  formConfig!: Partial<GnroFormConfig>;
  formFields: GnroFormField[] = [];
  values: object = {};

  close(): void {
    this.dialogRef.close('test uujj make');
  }
}
