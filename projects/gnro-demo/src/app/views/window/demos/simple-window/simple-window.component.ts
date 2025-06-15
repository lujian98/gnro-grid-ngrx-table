import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IccDialogService } from '@icc/ui/overlay';
import { AppDialogTestDemoComponent } from './dialog-test.component';

@Component({
  selector: 'app-simple-window',
  templateUrl: './simple-window.component.html',
  styleUrls: ['./simple-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppSimpleWindowComponent {
  private dialogService = inject(IccDialogService);

  openDialog(event: MouseEvent): void {
    let dialogRef = this.dialogService
      .open(AppDialogTestDemoComponent, {
        context: {
          dialog: {
            title: 'Test',
            content: 'Warning',
          },
        },
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((res) => {
        console.log(' on close res=', res);
      });
  }
}
