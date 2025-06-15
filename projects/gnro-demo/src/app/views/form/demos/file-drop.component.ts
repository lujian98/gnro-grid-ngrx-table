import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GnroFileDropEntry, GnroFileDropComponent } from '@gnro/ui/file-upload';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroFileDropComponent],
})
export class AppFileDropDemoComponent {
  title = 'gnro-file-drop-example';

  checked = true;
  entries: string[] = [];

  get className(): string {
    return !this.checked ? 'gnro-file-drop__drop-zone--disabled' : 'gnro-file-drop__drop-zone--enabled';
  }

  dropped(files: GnroFileDropEntry[]): void {
    this.entries = files.map((file) => file.relativePath);
    console.log(' this.entries=', this.entries);
  }

  onChange(event: any): void {
    this.checked = event.target.checked;
  }
}
