import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberBoardComponent } from './member-board.component';
import { MemberHoroscopeComponent } from './member-horoscope/member-horoscope.component';

const routes: Routes = [
  {
    path: '',
    data: { title: '新增會員' },
    component: MemberBoardComponent,
  },
  {
    path: 'horoscope/:id',
    data: { title: '算命結果' },
    component: MemberHoroscopeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberBoardRoutingModule {}
