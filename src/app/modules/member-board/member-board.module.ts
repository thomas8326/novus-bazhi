import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';


import { DirectivesModule } from 'src/app/directives/directives.module';
import { DialogTemplateModule } from 'src/app/modules/dialog-template/dialog-template.module';
import { ShardComponentsModule } from 'src/app/shard-components/shard-components.module';

import { MemberBoardComponent } from './member-board.component';
import { MemberBoardRoutingModule } from './member-board-routing.module';
import { MemberControlPanelComponent } from './member-control-panel/member-control-panel.component';
import { DobPickerComponent } from './dob-picker/dob-picker.component';
import { MemberHoroscopeComponent } from './member-horoscope/member-horoscope.component';
import { BadPropertyChartComponent } from './bad-property-chart/bad-property-chart.component';
import { LiuNianPickerComponent } from './liu-nian-picker/liu-nian-picker.component';
import { HoroscopeTableComponent } from './horoscope-table/horoscope-table.component';

@NgModule({
  declarations: [
    MemberBoardComponent,
    MemberControlPanelComponent,
    DobPickerComponent,
    MemberHoroscopeComponent,
    BadPropertyChartComponent,
    LiuNianPickerComponent,
    HoroscopeTableComponent,
  ],
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
    MatIconModule,
    OverlayModule,
    DirectivesModule,
    MatButtonModule,
    DialogTemplateModule,
    DragDropModule,
    ShardComponentsModule,
    MatSortModule,
    MatMenuModule,
    MatSelectModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'zh-TW' }],
})
export class MemberBoardModule { }
