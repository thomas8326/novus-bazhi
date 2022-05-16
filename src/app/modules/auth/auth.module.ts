import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from 'src/app/modules/auth/auth-routing.module';

import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
  ]
})
export class AuthModuleModule { }
