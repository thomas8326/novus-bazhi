import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { Member } from 'src/app/interfaces/會員';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

const TEST_DATA: Member[] = [
  {
    uid: 'test',
    name: 'Thomas',
    dob: '1994/11/26 05:30',
    gender: 性別.Male,
  },
];

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
    uid: [''],
    name: ['', Validators.required],
    dob: [moment(), Validators.required],
    gender: ['', Validators.required],
  });

  readonly member = 會員欄位;
  readonly memberGender = 性別;
  readonly testData = new MatTableDataSource<Member>(TEST_DATA);
  readonly displayedColumns: string[] = ['select', 會員欄位.Name, 會員欄位.Gender, 會員欄位.DateOfBirth, 'btnGroup'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.testData.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.testData.data.forEach((row) => this.selection.select(row));
    }
  }

  onAddNextMember() {
    if (this.memberForm.valid) {
      const newMember = new Member(this.memberForm.value);
      const newList = [...this.testData.data, newMember];
      this.testData.data = newList;
      this.memberForm.reset();
    }
  }

  onAddMember() {
    this.onAddNextMember();
    this.isAddingStatus = false;
    this.isAddingStatusChange.emit(false);
  }

  onUpdateMember() {
    this.testData.data = this.testData.data.map((member) =>
      member.uid === this.memberForm.value.uid ? this.memberForm.value : member,
    );
    this.isEditingStatus = false;
  }

  onDeleteMember(target: Member) {
    // TODO Dialog
    this.testData.data = this.testData.data.filter((member) => member.uid !== target.uid);
  }

  onEditMember(target: Member) {
    this.isEditingStatus = true;
    this.memberForm.setValue(target);
  }

  onCancel() {
    this.memberForm.reset();
    this.isAddingStatus = false;
    this.isEditingStatus = false;
    this.isAddingStatusChange.emit(false);
  }

  onRedirect(target: Member) {
    this.router.navigate([`horoscope/${target.uid}`], { relativeTo: this.activatedRoute });
  }
}
