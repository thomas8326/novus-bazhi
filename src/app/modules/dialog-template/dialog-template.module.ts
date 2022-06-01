import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { OpenDialogService } from 'src/app/modules/dialog-template/open-dialog.service';

import { DeletedPromptComponent } from './deleted-prompt/deleted-prompt.component';
import { SettingDialogComponent } from './setting-dialog/setting-dialog.component';
import { MemberEditDetailComponent } from './member-edit-detail/member-edit-detail.component';

@NgModule({
  declarations: [DeletedPromptComponent, SettingDialogComponent, MemberEditDetailComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSlideToggleModule],
  providers: [OpenDialogService],
})
export class DialogTemplateModule { }
