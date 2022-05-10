import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DeletedPromptComponent } from 'src/app/modules/dialog-template/deleted-prompt/deleted-prompt.component';

@Injectable()
export class OpenDialogService {
  constructor(public dialog: MatDialog) {}

  openDeletedPrompt(username: string, callback: () => void) {
    const dialogRef = this.dialog.open(DeletedPromptComponent, { data: { username } });
    dialogRef.afterClosed().subscribe((isDeleted) => {
      if (isDeleted) {
        callback();
      }
    });
  }
}
