import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { 會員欄位 } from 'src/app/enums/會員.enum';

import { Member } from './../../../interfaces/會員';

@Component({
  selector: 'app-member-edit-detail',
  templateUrl: './member-edit-detail.component.html',
  styleUrls: ['./member-edit-detail.component.scss']
})
export class MemberEditDetailComponent {

  member: Member;
  Member = 會員欄位;
  form = this.fb.group({
    [會員欄位.HandSize]: [''],
    [會員欄位.Job]: [''],
    [會員欄位.HasCondition]: [false],
  });

  constructor(private readonly dialogRef: MatDialogRef<MemberEditDetailComponent>, private readonly fb: FormBuilder, @Inject(MAT_DIALOG_DATA) private readonly data: { member: Member }) {
    this.member = data.member;
    this.form = this.fb.group({
      [會員欄位.HandSize]: [this.member.handSize || ''],
      [會員欄位.Job]: [this.member.job || ''],
      [會員欄位.HasCondition]: [this.member.hasCondition || false],
    })
  }

  onUpdate() {
    const newMember = { ...this.data.member, ...this.form.value };
    this.dialogRef.close(newMember);
  }
}
