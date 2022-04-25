import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-member-control-panel',
  templateUrl: './member-control-panel.component.html',
  styleUrls: ['./member-control-panel.component.scss'],
})
export class MemberControlPanelComponent implements OnInit {
  @Input() showAddBtn = false;
  @Input() showEditBtn = true;
  @Input() showRedirectBtn = false;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() redirect = new EventEmitter<void>();

  ngOnInit(): void {}

  onAdd() {
    this.add.emit();
  }
  onEdit() {
    this.edit.emit();
  }
  onDelete() {
    this.delete.emit();
  }
  onExport() {
    this.export.emit();
  }
  onRedirectTo() {
    this.redirect.emit();
  }
}
