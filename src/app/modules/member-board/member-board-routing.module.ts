import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LiuNianPickerComponent } from './liu-nian-picker/liu-nian-picker.component';
import { MemberBoardComponent } from './member-board.component';
import { MemberHoroscopeComponent } from './member-horoscope/member-horoscope.component';

const routes: Routes = [
  {
    path: '',
    data: { title: '新增會員資料', isMainPage: true },
    component: MemberBoardComponent,
  },
  {
    path: 'horoscope/:id',
    data: { title: '命盤' },
    component: LiuNianPickerComponent,
  },
  {
    path: 'horoscope/:id/result',
    data: { title: '命盤結果' },
    component: MemberHoroscopeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberBoardRoutingModule { }
