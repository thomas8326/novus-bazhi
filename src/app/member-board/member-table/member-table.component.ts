import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { 性別, 會員欄位 } from 'src/app/enums/會員.enum';
import { Member } from 'src/app/interfaces/會員';

const TEST_DATA: Member[] = [
  {
    name: 'Thomas',
    dob: '1994/11/26',
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

  name = new FormControl('');
  date = new FormControl('');
  gender = new FormControl('');

  readonly member = 會員欄位;
  readonly memberGender = 性別;
  readonly testData = new MatTableDataSource<Member>(TEST_DATA);
  readonly displayedColumns: string[] = ['select', 會員欄位.Name, 會員欄位.Gender, 會員欄位.DateOfBirth, 'btnGroup'];

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

  onAddMember() {
    const newMember: Member = {
      name: this.name.value,
      gender: this.gender.value,
      dob: new Date().toISOString(),
    };
    const newList = [...this.testData.data, newMember];
    this.testData.data = newList;
  }
}
