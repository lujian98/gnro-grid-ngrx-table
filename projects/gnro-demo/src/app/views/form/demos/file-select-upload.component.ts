import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GnroFileSelectUploadComponent } from '@gnro/ui/file-upload';

@Component({
  selector: 'app-file-select-upload',
  template: `<gnro-file-select-upload [fileUploadConfig]="fileUploadConfig"></gnro-file-select-upload>`,
  styles: [':host { width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroFileSelectUploadComponent],
})
export class AppFileSelectUploadComponent {
  fileUploadConfig = {
    urlKey: 'DCR',
  };
}
