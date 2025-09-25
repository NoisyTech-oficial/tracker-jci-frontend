import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

export class DocumentValidator {
  static validateDocumentLength(control: AbstractControl): ValidationErrors | null {
    const value = (control.value).replace(/[^\d]/g, '');

    if (value && (value.length !== 11 && value.length !== 14)) {
      return { invalidLength: true };
    }

    return null;
  }
}
