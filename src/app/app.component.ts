import { Data } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '';
  isMainPage = false;

  constructor(private readonly location: Location) { }

  onMainActivated(activateRoute: Data) {
    this.title = activateRoute.title;
    this.isMainPage = activateRoute.isMainPage;
  }

  onBack() {
    this.location.back();
  }
}
