import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccFileSelectUploadComponent } from '@icc/ui/file-upload';

@Component({
  selector: 'app-file-select-upload',
  template: `<icc-file-select-upload [fileUploadConfig]="fileUploadConfig"></icc-file-select-upload>`,
  styles: [':host { width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccFileSelectUploadComponent],
})
export class AppFileSelectUploadComponent {
  fileUploadConfig = {
    urlKey: 'DCR',
  };
}
