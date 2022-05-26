import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo } from "@angular/fire/compat/auth-guard";

import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { UserInfo } from 'firebase/auth';

const LOGIN_PATH = 'member-board';
const LOGOUT_PATH = 'userLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([LOGOUT_PATH]);
  static redirectLoggedIn = () => redirectLoggedInTo([LOGIN_PATH]);

  private readonly LOGIN_ERROR = '你尚未有權限能夠登入，請通知管理員。';
  private readonly errorState = new Subject<string>();
  private readonly user = new BehaviorSubject<UserInfo | null>(null);

  constructor(private readonly router: Router, private readonly auth: AngularFireAuth) {

  }

  getLoginUserName$(): Observable<UserInfo | null> {
    return this.auth.user;
  }

  onSignIn(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(
      email, password
    ).then(() => this.router.navigate([LOGIN_PATH])
    ).catch(() => this.setErrorMsg(this.LOGIN_ERROR));
  }

  onSignOut() {
    this.auth.signOut().then(() => this.router.navigate([LOGOUT_PATH]));
  }

  getErrorMsg$(): Observable<string> {
    return this.errorState;
  }

  setErrorMsg(msg: string) {
    this.errorState.next(msg);
  }
}
