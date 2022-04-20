import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MemberBoardRoutingModule } from './member-board-routing.module';
import { MemberBoardComponent } from './member-board.component';
import { MemberTableComponent } from './member-table/member-table.component';
import { MemberControlPanelComponent } from './member-control-panel/member-control-panel.component';

@NgModule({
  declarations: [MemberBoardComponent, MemberTableComponent, MemberControlPanelComponent],
  imports: [CommonModule, MemberBoardRoutingModule, MatTableModule, MatCheckboxModule],
})
export class MemberBoardModule {}
