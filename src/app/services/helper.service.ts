import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  convertToTitleCase(inputStr: string) {
    let returnStr = '';
    if (inputStr && inputStr !== null) {
      inputStr = inputStr.toLowerCase();
      returnStr = inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
    }
    return returnStr;
  }

  mustMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({
          mustMatch: true
        });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  transAmountValidator(amountControl: string, accountControl: string) {
    return (formGroup: FormGroup) => {
      const amountCtrl = formGroup.controls[amountControl];
      const accountCtrl = formGroup.controls[accountControl];

      if (amountCtrl.errors && amountCtrl.errors.insufficientFunds) {
        return;
      }
      if (accountCtrl.value !== null && amountCtrl.value !== null) {
        if (accountCtrl.value.balance < amountCtrl.value) {
          amountCtrl.setErrors({
            insufficientFunds: true
          });
        } else {
          amountCtrl.setErrors(null);
        }
      } else {
        amountCtrl.setErrors(null);
      }
    };
  }

  transAccountValidator(fromAccount: string, toAccount: string) {
    return (formGroup: FormGroup) => {
      const fromAccountCtrl = formGroup.controls[fromAccount];
      const toAccountCtrl = formGroup.controls[toAccount];

      if (toAccountCtrl.errors && toAccountCtrl.errors.sameAccount) {
        return;
      }
      if (fromAccountCtrl.value !== null && toAccountCtrl.value !== null) {
        if (fromAccountCtrl.value._id === toAccountCtrl.value._id) {
          toAccountCtrl.setErrors({
            sameAccount: true
          });
        } else {
          toAccountCtrl.setErrors(null);
        }
      } else {
        toAccountCtrl.setErrors(null);
      }
    };
  }

  getUTCDate(inputDate: Date) {
    if (inputDate) {
      return new Date(inputDate.getTime() - (inputDate.getTimezoneOffset() * 60000));
    } else {
      return null;
    }
  }
}
