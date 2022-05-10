import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { OpenDialogService } from 'src/app/modules/dialog-template/open-dialog.service';

import { DeletedPromptComponent } from './deleted-prompt/deleted-prompt.component';

@NgModule({
  declarations: [DeletedPromptComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  providers: [OpenDialogService],
})
export class DialogTemplateModule {}
