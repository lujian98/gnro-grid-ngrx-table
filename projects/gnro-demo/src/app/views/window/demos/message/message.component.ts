import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroDialogService } from '@gnro/ui/overlay';
import { GnroMessageComponent, defaultMessageConfig } from '@gnro/ui/window';

@Component({
  selector: 'app-message',
  template: `
    <div (click)="openComfirmationWindow($event)">Click to Open Message Window</div>
    <div (click)="openYesNoMessageWindow($event)">Click to Open Message Yes/No Window</div>
    <div (click)="openMessageWindow($event)">Click to Open Message Window</div>
    <div (click)="openSimpleWindow($event)">Click to Open Simple Window</div>
    <div (click)="openWindowOnly($event)">Click to Open Window Only</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppMessageComponent {
  private dialogService = inject(GnroDialogService);

  openComfirmationWindow(event: MouseEvent): void {
    let dialogRef = this.dialogService
      .open(GnroMessageComponent, {
        context: {
          messageConfig: {
            ...defaultMessageConfig,
            title: 'Test Message',
            showOkButton: true,
            showCancelButton: true,
            message: 'This is message to exit',
          },
        },
        closeOnBackdropClick: true,
      })
      .onClose.subscribe((res) => {
        console.log(' on close res=', res);
      });
  }

  openYesNoMessageWindow(event: MouseEvent): void {
    this.dialogService
      .open(GnroMessageComponent, {
        context: {
          messageConfig: {
            ...defaultMessageConfig,
            title: 'Test Yes/No Message',
            showOkButton: true,
            ok: 'Yes',
            showCancelButton: true,
            cancel: 'No',
            message: 'This is Yes/No message to close',
          },
        },
        closeOnBackdropClick: true,
      })
      .onClose.subscribe((res) => {
        console.log(' on close res=', res);
      });
  }

  openMessageWindow(event: MouseEvent): void {
    this.dialogService
      .open(GnroMessageComponent, {
        context: {
          messageConfig: {
            ...defaultMessageConfig,
            title: 'Test Message Window Close',
            showOkButton: true,
            message: 'This is Message Window to close',
          },
        },
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((res) => {
        console.log(' on close res=', res);
      });
  }

  openSimpleWindow(event: MouseEvent): void {
    this.dialogService
      .open(GnroMessageComponent, {
        context: {
          messageConfig: {
            ...defaultMessageConfig,
            showHeader: false,
            showCloseButton: true,
          },
        },
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((res) => {
        console.log(' on close res=', res);
      });
  }

  openWindowOnly(event: MouseEvent): void {
    this.dialogService
      .open(GnroMessageComponent, {
        context: {
          messageConfig: {
            ...defaultMessageConfig,
            showHeader: false,
            showFooter: false,
            height: '300px',
            message: 'This is show window only. Click outside to close',
          },
        },
        closeOnBackdropClick: true,
      })
      .onClose.subscribe((res) => {
        console.log(' on close res=', res);
      });
  }
}
