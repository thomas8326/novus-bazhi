import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-deleted-prompt',
  templateUrl: './deleted-prompt.component.html',
  styleUrls: ['./deleted-prompt.component.scss'],
})
export class DeletedPromptComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { username: string }) {}

  ngOnInit(): void {}
}
