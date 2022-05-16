import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  readonly LoginError = '你尚未有權限能夠登入，請通知管理員。';
  isError = false;

  constructor(private readonly auth: AngularFireAuth, private readonly router: Router) {

  }

  onLogin() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => this.router.navigate(['member-board'])).catch(() => this.isError = true);
  }

  ngOnInit(): void {
  }

}
