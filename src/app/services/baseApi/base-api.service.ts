
import { Injectable } from '@angular/core';
import { AngularFireDatabase, QueryFn } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {

  constructor(private readonly realtime: AngularFireDatabase) { }

  get<T>(url: string, params?: QueryFn) {
    return this.realtime.list<T>(url, params).valueChanges();
  }

  getItem<T>(url: string) {
    return this.realtime.object<T>(url).valueChanges();
  }

  // post and update
  post<T>(url: string, body: any) {
    const object = this.realtime.object<T>(url);
    object.set(body);
  }

  patch<T>(url: string, body: any) {
    const object = this.realtime.object<T>(url);
    object.update(body);
  }

  delete(url: string) {
    const object = this.realtime.object(url);
    object.remove();
  }
}
