import { Data, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '';
  isRendered = false;
  isMainPage = false;
  isLoginPage = false;

  constructor(private readonly location: Location, private readonly auth: AngularFireAuth, private readonly router: Router) { }

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
    this.auth.signOut().then(() => this.router.navigate(['userLogin']));
  }
}
