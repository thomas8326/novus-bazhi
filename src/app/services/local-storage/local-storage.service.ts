import { Injectable } from '@angular/core';

export enum StorageField {
  WuXinHint = 'wuXinHint'
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  init() {
    this.checkAndSetValue(StorageField.WuXinHint, true);
  }

  get(key: StorageField) {
    return localStorage.getItem(key);
  }

  set(key: StorageField, value: any) {
    localStorage.setItem(key, value);
  }

  private checkAndSetValue(key: StorageField, initValue: any) {
    if (this.get(key) === null || this.get(key) === undefined) {
      this.set(key, initValue);
    }
  }
}
