import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum ErrorMsg {
  InputNumber = '請輸入數字'
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  showWarning(errorMsg: ErrorMsg | string, duration = 1200) {
    this.snackbar.open(errorMsg, '', {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
