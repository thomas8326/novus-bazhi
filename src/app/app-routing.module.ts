import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'member-board',
    pathMatch: 'full',
  },
  {
    path: 'member-board',
    loadChildren: () => import('./member-board/member-board.module').then((m) => m.MemberBoardModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
