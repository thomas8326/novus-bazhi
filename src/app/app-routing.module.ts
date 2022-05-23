import { RouterModule, Routes } from '@angular/router';
import { canActivate } from '@angular/fire/compat/auth-guard';
import { NgModule } from '@angular/core';

import { AuthService } from 'src/app/modules/auth/auth.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'userLogin',
    pathMatch: 'full',
  },
  {
    path: 'member-board',
    loadChildren: () => import('./modules/member-board/member-board.module').then((m) => m.MemberBoardModule),
    ...canActivate(AuthService.redirectUnauthorizedToLogin),
  },
  {
    path: 'userLogin',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModuleModule),
    ...canActivate(AuthService.redirectLoggedIn),
  },
  { path: '**', redirectTo: 'userLogin' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
