import { Component } from '@angular/core';

import { LocalStorageService, StorageField } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-setting-dialog',
  templateUrl: './setting-dialog.component.html',
  styleUrls: ['./setting-dialog.component.scss']
})
export class SettingDialogComponent {

  constructor(private readonly localStorage: LocalStorageService) { }

  getWuXinHintValue() {
    return this.localStorage.get(StorageField.WuXinHint);
  }

  onSlideWuXin(value: boolean) {
    this.localStorage.set(StorageField.WuXinHint, value);
  }

}
