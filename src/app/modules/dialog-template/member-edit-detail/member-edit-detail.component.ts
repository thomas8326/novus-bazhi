import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  form: FormGroup | null = null;

  constructor(private readonly dialogRef: MatDialogRef<MemberEditDetailComponent>, private readonly fb: FormBuilder, @Inject(MAT_DIALOG_DATA) private readonly data: { member: Member }) {
    this.member = data.member;
    this.initForm();
  }

  onUpdate() {
    if (!this.form) {
      throw new Error('Member Detail Form 沒有被正確初始化')
    }
    const newMember = { ...this.data.member, ...this.form.value };
    this.dialogRef.close(newMember);
  }

  initForm() {
    this.form = this.fb.group({
      [會員欄位.HandSize]: [this.member.handSize || ''],
      [會員欄位.Job]: [this.member.job || ''],
      [會員欄位.CrystalStyle]: [this.member.crystalStyle || ''],
      [會員欄位.HasCondition]: [this.member.hasCondition || false],
    })
  }
}
