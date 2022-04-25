import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';

import { Member } from 'src/app/interfaces/會員';

@Component({
  selector: 'app-member-board',
  templateUrl: './member-board.component.html',
  styleUrls: ['./member-board.component.scss'],
})
export class MemberBoardComponent implements OnInit {
  readonly selection = new SelectionModel<Member>(true, []);
  isAddingStatus = false;

  ngOnInit(): void {}
}
