import { MatRadioModule } from '@angular/material/radio';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { OpenDialogService } from 'src/app/modules/dialog-template/open-dialog.service';

import { DeletedPromptComponent } from './deleted-prompt/deleted-prompt.component';
import { SettingDialogComponent } from './setting-dialog/setting-dialog.component';
import { MemberEditDetailComponent } from './member-edit-detail/member-edit-detail.component';

@NgModule({
  declarations: [DeletedPromptComponent, SettingDialogComponent, MemberEditDetailComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [OpenDialogService],
})
export class DialogTemplateModule { }
