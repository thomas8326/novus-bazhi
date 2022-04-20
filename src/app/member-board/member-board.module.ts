import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MemberBoardComponent } from './member-board.component';
import { MemberBoardRoutingModule } from './member-board-routing.module';
import { MemberTableComponent } from './member-table/member-table.component';
import { MemberControlPanelComponent } from './member-control-panel/member-control-panel.component';
import { DobPickerComponent } from './dob-picker/dob-picker.component';

@NgModule({
  declarations: [MemberBoardComponent, MemberTableComponent, MemberControlPanelComponent, DobPickerComponent],
  imports: [
    CommonModule,
    MemberBoardRoutingModule,
    MatTableModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,
  ],
})
export class MemberBoardModule {}
