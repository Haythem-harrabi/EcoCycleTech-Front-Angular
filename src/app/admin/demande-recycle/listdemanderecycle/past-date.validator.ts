import {
    Directive,
    forwardRef,
    Provider,
  } from '@angular/core';
  import {
    NG_VALIDATORS,
    Validator,
    AbstractControl,
    ValidationErrors,
  } from '@angular/forms';
  
  export const PAST_DATE_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PastDateValidatorDirective),
    multi: true,
  };
  
  @Directive({
    selector: '[pastDate]',    // ← this becomes the attribute you drop on your <input>
    providers: [PAST_DATE_VALIDATOR]
  })
  export class PastDateValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
      if (!control.value) {
        return null;            // leave “required” to the built-in validator
      }
  
      const inputDate = new Date(control.value);
      const today     = new Date();
  
      inputDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
  
      // valid if ≤ today, invalid if > today
      return inputDate <= today
        ? null
        : { notInPast: true };
    }
  }
  