import { Data } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserInfo } from '@angular/fire/auth';

import { Observable } from 'rxjs';
import { OpenDialogService } from 'src/app/modules/dialog-template/open-dialog.service';

import { LocalStorageService } from './services/local-storage/local-storage.service';
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

  constructor(private readonly location: Location,
    private readonly authService: AuthService,
    private openDialogService: OpenDialogService,
    private readonly localStorage: LocalStorageService,) {
    this.userInfo$ = this.authService.getLoginUserName$();
    this.localStorage.init();
  }

  onOpenSetting() {
    this.openDialogService.openSettingDialog();
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
