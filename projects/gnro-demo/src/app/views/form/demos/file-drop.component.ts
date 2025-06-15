import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IccFileDropEntry, IccFileDropComponent } from '@icc/ui/file-upload';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IccFileDropComponent],
})
export class AppFileDropDemoComponent {
  title = 'icc-file-drop-example';

  checked = true;
  entries: string[] = [];

  get className(): string {
    return !this.checked ? 'icc-file-drop__drop-zone--disabled' : 'icc-file-drop__drop-zone--enabled';
  }

  dropped(files: IccFileDropEntry[]): void {
    this.entries = files.map((file) => file.relativePath);
    console.log(' this.entries=', this.entries);
  }

  onChange(event: any): void {
    this.checked = event.target.checked;
  }
}
