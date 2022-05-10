import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { OpenDialogService } from 'src/app/modules/dialog-template/open-dialog.service';

@Component({
  selector: 'app-member-control-panel',
  templateUrl: './member-control-panel.component.html',
  styleUrls: ['./member-control-panel.component.scss'],
})
export class MemberControlPanelComponent implements OnInit {
  @Input() showAddBtn = false;
  @Input() showEditBtn = true;
  @Input() showRedirectBtn = false;
  @Input() showExport = false;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() redirect = new EventEmitter<void>();

  constructor(private readonly openDialogService: OpenDialogService) {}

  ngOnInit(): void {}

  onAdd() {
    this.add.emit();
  }
  onEdit() {
    this.edit.emit();
  }
  onDelete() {
    const callback = () => this.delete.emit();
    this.openDialogService.openDeletedPrompt('a', callback);
  }
  onExport() {
    this.export.emit();
  }
  onRedirectTo() {
    this.redirect.emit();
  }
}
