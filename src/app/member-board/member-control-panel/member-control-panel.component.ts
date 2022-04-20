import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-control-panel',
  templateUrl: './member-control-panel.component.html',
  styleUrls: ['./member-control-panel.component.scss'],
})
export class MemberControlPanelComponent implements OnInit {
  @Input() showAddBtn = false;

  ngOnInit(): void {}
}
