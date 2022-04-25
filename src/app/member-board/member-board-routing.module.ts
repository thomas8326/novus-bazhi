import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberBoardComponent } from 'src/app/member-board/member-board.component';
import { MemberHoroscopeComponent } from 'src/app/member-board/member-horoscope/member-horoscope.component';

const routes: Routes = [
  {
    path: '',
    component: MemberBoardComponent,
  },
  {
    path: 'horoscope/:id',
    component: MemberHoroscopeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberBoardRoutingModule {}
