import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from 'src/app/modules/auth/auth-routing.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    DirectivesModule
  ]
})
export class AuthModuleModule { }
