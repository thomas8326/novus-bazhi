import { Injectable } from '@angular/core';
import { take } from '@angular/fire/node_modules/rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Member } from 'src/app/interfaces/會員';
import { DeletedPromptComponent } from 'src/app/modules/dialog-template/deleted-prompt/deleted-prompt.component';
import { SettingDialogComponent } from 'src/app/modules/dialog-template/setting-dialog/setting-dialog.component';

import { MemberEditDetailComponent } from './member-edit-detail/member-edit-detail.component';

@Injectable()
export class OpenDialogService {
  constructor(public dialog: MatDialog) { }

  openDeletedPrompt(username: string, callback: () => void) {
    const dialogRef = this.dialog.open(DeletedPromptComponent, { data: { username } });
    dialogRef.afterClosed().pipe(take(1)).subscribe((isDeleted) => {
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

  openMemberEditDetailDialog(member: Member, callback: (member: Member) => void) {
    const dialogRef = this.dialog.open(MemberEditDetailComponent, {
      width: '30vw',
      minWidth: '330px',
      height: '100vh',
      panelClass: ['animation_rightToLeft'],
      position: {
        right: '0px',
      },
      data: { member }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((newMember: Member) => {
      if (newMember) {
        callback(newMember);
      }
    });
  }
}
