import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'userLogin',
    pathMatch: 'full',
  },
  {
    path: 'member-board',
    loadChildren: () => import('./modules/member-board/member-board.module').then((m) => m.MemberBoardModule),
  },
  {
    path: 'userLogin',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModuleModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
