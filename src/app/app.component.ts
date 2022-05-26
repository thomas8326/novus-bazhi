import { Data } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserInfo } from '@angular/fire/auth';

import { Observable } from 'rxjs';

import { AuthService } from './modules/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '';
  isRendered = false;
  isMainPage = true;
  isLoginPage = false;

  userInfo$: Observable<UserInfo | null>;

  constructor(private readonly location: Location, private readonly authService: AuthService) {
    this.userInfo$ = this.authService.getLoginUserName$();
  }

  onMainActivated(activateRoute: Data) {
    this.isRendered = true;
    this.title = activateRoute.title;
    this.isMainPage = activateRoute.isMainPage;
    this.isLoginPage = activateRoute.isLoginPage;
  }

  onBack() {
    this.location.back();
  }

  onLogout() {
    this.authService.onSignOut();
  }
}
