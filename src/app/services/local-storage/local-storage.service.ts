import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

export enum StorageField {
  WuXinHint = 'wuXinHint'
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private localStorageChanged = new BehaviorSubject<void | null>(null);

  init() {
    this.checkAndSetValue(StorageField.WuXinHint, true);
  }

  getLocalStorageChanged$(): Observable<void | null> {
    return this.localStorageChanged;
  }

  getHasWuXinHint(): boolean {
    return this.get(StorageField.WuXinHint) === 'true';
  }

  get(key: StorageField) {
    return localStorage.getItem(key);
  }

  set(key: StorageField, value: any) {
    this.localStorageChanged.next();
    localStorage.setItem(key, value);
  }

  private checkAndSetValue(key: StorageField, initValue: any) {
    if (this.get(key) === null || this.get(key) === undefined) {
      this.set(key, initValue);
    }
  }
}
