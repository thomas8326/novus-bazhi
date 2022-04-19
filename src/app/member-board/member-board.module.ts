import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberBoardRoutingModule } from './member-board-routing.module';
import { MemberBoardComponent } from './member-board.component';

@NgModule({
  declarations: [MemberBoardComponent],
  imports: [CommonModule, MemberBoardRoutingModule],
})
export class MemberBoardModule {}
