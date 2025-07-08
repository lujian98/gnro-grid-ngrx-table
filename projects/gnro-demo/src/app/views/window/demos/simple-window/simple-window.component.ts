import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroDialogService } from '@gnro/ui/overlay';
import { AppDialogTestDemoComponent } from './dialog-test.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-simple-window',
  templateUrl: './simple-window.component.html',
  styleUrls: ['./simple-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatRadioModule, FormsModule, ReactiveFormsModule],
})
export class AppSimpleWindowComponent {
  private dialogService = inject(GnroDialogService);
  myForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      radioSelection: [''],
    });
  }

  shouldDisableOption1(): boolean {
    // Add your logic here to determine if option 1 should be disabled
    // Example: Disable if another form control has a specific value
    return false;
  }

  shouldDisableOption2(): boolean {
    // Add your logic here to determine if option 2 should be disabled
    return true; // Example: Always enable option 2
  }

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
