import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberBoardComponent } from 'src/app/member-board/member-board.component';

const routes: Routes = [
  {
    path: '',
    component: MemberBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberBoardRoutingModule {}
