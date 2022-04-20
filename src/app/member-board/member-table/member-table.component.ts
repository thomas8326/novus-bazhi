import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { 會員欄位 } from 'src/app/enums/會員.enum';
import { Member } from 'src/app/interfaces/會員';

const TEST_DATA: Member[] = [
  {
    name: 'Thomas',
    dob: '1994/11/26',
    gender: '男',
  },
];

@Component({
  selector: 'app-member-table',
  templateUrl: './member-table.component.html',
  styleUrls: ['./member-table.component.scss'],
})
export class MemberTableComponent implements OnInit {
  readonly member = 會員欄位;

  readonly testData = new MatTableDataSource<Member>(TEST_DATA);

  readonly selection = new SelectionModel<Member>(true, []);

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
}
