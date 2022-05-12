import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { Member } from 'src/app/interfaces/會員';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MemberService } from 'src/app/services/member/member.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';

const moment = _rollupMoment || _moment;

@UntilDestroy()
@Component({
  selector: 'app-member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.scss'],
})
export class MemberTableComponent implements OnInit {
  @Input() selection = new SelectionModel<Member>(true, []);
  @Input() isAddingStatus = false;
  @Output() isAddingStatusChange = new EventEmitter<boolean>();

  isEditingStatus = false;

  memberForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    dob: [moment(), Validators.required],
    gender: ['', Validators.required],
    comment: [''],
    completed: [false],
  });

  readonly member = 會員欄位;
  readonly memberGender = 性別;
  readonly displayedColumns: string[] = [
    會員欄位.Name,
    會員欄位.Gender,
    會員欄位.DateOfBirth,
    會員欄位.Completed,
    會員欄位.Comment,
    'btnGroup',
  ];

  members: Member[] = [];
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
  ) {
    this.memberService.get().subscribe((members) => (this.members = members));
  }

  ngOnInit(): void {}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.members.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.members.forEach((row) => this.selection.select(row));
    }
  }

  onAddNextMember() {
    if (this.memberForm.valid) {
      const newMember = new Member(this.memberForm.value);
      this.memberService.create(newMember).pipe(take(1)).subscribe();
      this.members = [...this.members, newMember];
      this.memberForm.reset();
    }
  }

  onAddMember() {
    this.onAddNextMember();
    this.isAddingStatus = false;
    this.isAddingStatusChange.emit(false);
  }

  onUpdateMember() {
    if (this.memberForm.valid) {
      const updatedMember = new Member(this.memberForm.value);
      this.members = this.members.map((member) => (member.id === updatedMember.id ? updatedMember : member));
      this.memberService.replace(updatedMember.id, updatedMember).pipe(take(1)).subscribe();
      this.isEditingStatus = false;
    }
  }

  onDeleteMember(target: Member) {
    this.members = this.members.filter((member) => member.id !== target.id);
    this.memberService.delete(target.id).pipe(take(1)).subscribe();
  }

  onEditMember(target: Member) {
    this.isEditingStatus = true;
    this.memberForm.patchValue(target);
  }

  onCancel() {
    this.memberForm.reset();
    this.isAddingStatus = false;
    this.isEditingStatus = false;
    this.isAddingStatusChange.emit(false);
  }

  onRedirect(target: Member) {
    this.router.navigate([`horoscope/${target.id}`], { relativeTo: this.activatedRoute });
  }

  onCheckCompleted(id: string, isChecked: boolean) {
    this.memberService.replace(id, { completed: isChecked }).pipe(take(1)).subscribe();
  }

  onUpdateComment(id: string, text: string) {
    this.memberService.replace(id, { comment: text }).pipe(take(1)).subscribe();
  }
}
