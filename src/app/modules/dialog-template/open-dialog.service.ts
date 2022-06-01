import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DeletedPromptComponent } from 'src/app/modules/dialog-template/deleted-prompt/deleted-prompt.component';
import { SettingDialogComponent } from 'src/app/modules/dialog-template/setting-dialog/setting-dialog.component';

import { MemberEditDetailComponent } from './member-edit-detail/member-edit-detail.component';

@Injectable()
export class OpenDialogService {
  constructor(public dialog: MatDialog) { }

  openDeletedPrompt(username: string, callback: () => void) {
    const dialogRef = this.dialog.open(DeletedPromptComponent, { data: { username } });
    dialogRef.afterClosed().subscribe((isDeleted) => {
      if (isDeleted) {
        callback();
      }
    });
  }

  openSettingDialog() {
    this.dialog.open(SettingDialogComponent, {
      width: '300px',
      height: '250px'
    });
  }

  openMemberEditDetailDialog() {
    this.dialog.open(MemberEditDetailComponent, {
      width: '300px',
      height: '250px'
    });
  }
}
