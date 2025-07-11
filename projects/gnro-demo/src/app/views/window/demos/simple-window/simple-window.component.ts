import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GnroDialogService } from '@gnro/ui/overlay';
import { AppDialogTestDemoComponent } from './dialog-test.component';
//import { GnroRadioComponent } from '../../../../radio/radio.component';
//import { GnroRadioGroupDirective } from '../../../../radio/radio-group.directive';
//import { MatRadioModule } from '@angular/material/radio'/
import { GnroRadioComponent, GnroRadioGroupDirective } from '@gnro/ui/radio-group';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-simple-window',
  templateUrl: './simple-window.component.html',
  styleUrls: ['./simple-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GnroRadioComponent, GnroRadioGroupDirective, FormsModule, ReactiveFormsModule],
})
export class AppSimpleWindowComponent {
  private dialogService = inject(GnroDialogService);
  myForm!: FormGroup;

  radioName = 'testradio11';
  constructor(private fb: FormBuilder) {}

  fieldName = 'radioSelection';
  ngOnInit(): void {
    this.myForm = this.fb.group({
      [this.fieldName]: new FormControl<any>({ value: 'option3', disabled: false }),
    });
  }
  //  new FormControl<string>({ value: '', disabled: !!field.readonly }, []));
  groups = [
    { value: 'option1', disabled: false },
    { value: 'option2', disabled: true },
    { value: 'option3', disabled: false },
    { value: 'option4', disabled: false },
    { value: 'option5', disabled: true },
    { value: 'option6', disabled: false },
  ];

  testClick() {
    const field = this.myForm.get(this.fieldName);
    //field?.disable();
    console.log(' field =', field);
    console.log(' field value =', field?.getRawValue());
    field?.setValue('option3');
    console.log(' reset field value =', field?.getRawValue());
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
