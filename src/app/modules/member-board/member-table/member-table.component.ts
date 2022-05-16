import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { Member } from 'src/app/interfaces/會員';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { MemberService } from 'src/app/services/member/member.service';
import { UntilDestroy } from '@ngneat/until-destroy';
const moment = _rollupMoment || _moment;

@UntilDestroy()
@Component({
  selector: 'app-member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.scss'],
})
export class MemberTableComponent implements OnInit {
  @Input() selection = new SelectionModel<Member>(true, []);
  @Input('isAddingStatus')
  set setIsAddingStatus(value: boolean) {
    if (value) {
      this.memberForm.reset();
      this.memberForm.patchValue({ dob: moment() });
      this.isEditingStatus = false;
    }

    this.isAddingStatus = value;
  }
  @Input('searchText')
  set setSearchText(value: string) {
    if (this.memberDataSource) {
      this.memberDataSource.filter = value;
    }
  }
  @Output() isAddingStatusChange = new EventEmitter<boolean>();

  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (this.memberDataSource) {
      this.memberDataSource.sort = value;
      this.memberDataSource.sortData(this.memberDataSource.data, this.memberDataSource.sort);
    }
  }

  isAddingStatus = false;
  isEditingStatus = false;

  @ViewChild(MatSort, { static: false }) MatSort: MatSort | null = null;
  memberDataSource = new MatTableDataSource<Member>();

  memberForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    dob: [moment(), Validators.required],
    gender: ['', Validators.required],
    comment: [''],
    completed: [false],
  });

  readonly member = 會員欄位;
  readonly memberGender = 性別;
  readonly displayedColumns: string[] = [
    會員欄位.Name,
    會員欄位.Phone,
    會員欄位.Gender,
    會員欄位.DateOfBirth,
    會員欄位.Completed,
    會員欄位.Comment,
    'btnGroup',
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
  ) {

  }

  ngOnInit(): void {
    this.memberService.get().subscribe((members) => {
      this.memberDataSource.data = members.sort(this.compareCreateTime);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.memberDataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.memberDataSource.data.forEach((row) => this.selection.select(row));
    }
  }

  onAddNextMember() {
    if (this.memberForm.valid) {
      const newMember = new Member(this.memberForm.value);
      this.memberService.create(newMember);
      this.memberDataSource.data = [newMember].concat(this.memberDataSource.data);
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
      this.memberDataSource.data = this.memberDataSource.data.map((member) => (member.id === updatedMember.id ? updatedMember : member));
      this.memberService.replace(updatedMember.id, updatedMember);
      this.isEditingStatus = false;
    }
  }

  onDeleteMember(target: Member) {
    this.memberDataSource.data = this.memberDataSource.data.filter((member) => member.id !== target.id);
    this.memberService.delete(target.id);
  }

  onEditMember(target: Member) {
    this.setAddStatus(false);
    this.isEditingStatus = true;
    this.memberForm.patchValue(target);
  }

  onCancel() {
    this.setAddStatus(false);
    this.isEditingStatus = false;
    this.memberForm.reset();
    this.memberForm.patchValue({ dob: moment() });
  }

  onRedirect(target: Member) {
    this.router.navigate([`horoscope/${target.id}`], { relativeTo: this.activatedRoute });
  }

  onCheckCompleted(id: string, isChecked: boolean) {
    this.memberService.replace(id, { completed: isChecked });
  }

  onUpdateComment(id: string, text: string) {
    this.memberService.replace(id, { comment: text });
  }

  private compareCreateTime(m1: Member, m2: Member) {
    const m1CreateTime = m1.createTime;
    const m2CreateTime = m2.createTime;

    return m1CreateTime > m2CreateTime && !m1.completed ? -1 : 1
  };

  private setAddStatus(status: boolean) {
    this.isAddingStatus = status;
    this.isAddingStatusChange.emit(status);
  }
}
