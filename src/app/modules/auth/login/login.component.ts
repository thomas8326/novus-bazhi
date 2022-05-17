import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isClicked = false;
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  errorMsg$: Observable<string>;

  constructor(readonly authService: AuthService) {
    this.errorMsg$ = this.authService.getErrorMsg$();
  }

  onLogin() {
    if (this.email.valid && this.password.valid) {
      this.authService.onSignIn(this.email.value, this.password.value);
    }
  }

}
