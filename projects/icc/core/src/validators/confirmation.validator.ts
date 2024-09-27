import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmationValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (controls: AbstractControl): ValidationErrors | null => {
    const control = controls.get(controlName);
    const matchingControl = controls.get(matchingControlName);
    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ confirmedValidator: { message: 'PASSWORD_NOT_EQUAL' } });
      return { confirmedValidator: true };
    }
    matchingControl?.setErrors(null);
    return null;
  };
}
