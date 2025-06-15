import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styles: [':host {  display: flex; flex-direction: column; width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTabsModule, MatInputModule, ReactiveFormsModule, FormsModule, MatFormFieldModule],
})
export class AppTabGroupComponent {
  formGroup: FormGroup = new FormGroup({
    field1: new FormControl('field1'),
    field2: new FormControl('field2'),
  });

  checkForm(): void {
    const values = this.formGroup.value;
    console.log(' check form values =', values);
  }
}
