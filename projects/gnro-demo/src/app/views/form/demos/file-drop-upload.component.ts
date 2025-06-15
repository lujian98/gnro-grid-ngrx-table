import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccFileDropUploadComponent } from '@icc/ui/file-upload';

@Component({
  selector: 'app-file-drop-upload',
  template: `<icc-file-drop-upload [fileUploadConfig]="fileUploadConfig"></icc-file-drop-upload>`,
  styles: [':host { width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccFileDropUploadComponent],
})
export class AppFileDropUploadComponent {
  fileUploadConfig = {
    urlKey: 'DCR',
  };
}
