import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IccDialogService } from '@icc/ui/overlay';
import { IccConfirmationComponent, defaultConfirmationConfig } from '@icc/ui/window';

@Component({
  selector: 'app-confirmation',
  template: `
    <div (click)="openConfirmationWindow($event)">Click to Open Confirmation Window</div>
    <div (click)="openYesNoConfirmationWindow($event)">Click to Open Confirmation Yes/No Window</div>
    <div (click)="openMessageWindow($event)">Click to Open Message Window</div>
    <div (click)="openSimpleWindow($event)">Click to Open Simple Window</div>
    <div (click)="openWindowOnly($event)">Click to Open Window Only</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppConfirmationComponent {
  private dialogService = inject(IccDialogService);

  openConfirmationWindow(event: MouseEvent): void {
    let dialogRef = this.dialogService
      .open(IccConfirmationComponent, {
        context: {
          confirmationConfig: {
            ...defaultConfirmationConfig,
            title: 'Test Confirmation',
            showOkButton: true,
            showCancelButton: true,
            message: 'This is confirmation to exit',
          },
        },
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((res) => {
        console.log(' on close res=', res);
      });
  }

  openYesNoConfirmationWindow(event: MouseEvent): void {
    this.dialogService
      .open(IccConfirmationComponent, {
        context: {
          confirmationConfig: {
            ...defaultConfirmationConfig,
            title: 'Test Yes/No Confirmation',
            showOkButton: true,
            ok: 'Yes',
            showCancelButton: true,
            cancel: 'No',
            message: 'This is Yes/No confirmation to close',
          },
        },
        closeOnBackdropClick: false,
      })
      .onClose.subscribe((res) => {
        console.log(' on close res=', res);
      });
  }

  openMessageWindow(event: MouseEvent): void {
    this.dialogService
      .open(IccConfirmationComponent, {
        context: {
          confirmationConfig: {
            ...defaultConfirmationConfig,
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
      .open(IccConfirmationComponent, {
        context: {
          confirmationConfig: {
            ...defaultConfirmationConfig,
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
      .open(IccConfirmationComponent, {
        context: {
          confirmationConfig: {
            ...defaultConfirmationConfig,
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
