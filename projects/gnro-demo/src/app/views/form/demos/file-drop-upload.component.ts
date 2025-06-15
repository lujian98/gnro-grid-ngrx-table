import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GnroFileDropUploadComponent } from '@gnro/ui/file-upload';

@Component({
  selector: 'app-file-drop-upload',
  template: `<gnro-file-drop-upload [fileUploadConfig]="fileUploadConfig"></gnro-file-drop-upload>`,
  styles: [':host { width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroFileDropUploadComponent],
})
export class AppFileDropUploadComponent {
  fileUploadConfig = {
    urlKey: 'DCR',
  };
}
