import { Injectable } from '@angular/core';

import { Member } from 'src/app/interfaces/會員';
import { Observable } from 'rxjs/internal/Observable';
import { BaseApiService } from 'src/app/services/baseApi/base-api.service';
import { map } from 'rxjs/operators';

const API_PATH = 'members';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  constructor(private readonly apiService: BaseApiService) {}

  create(member: Member): Observable<void> {
    return this.apiService.post(API_PATH, member);
  }

  get(): Observable<Member[]> {
    return this.apiService.get<Member[]>(API_PATH).pipe(map((result) => result));
  }

  getMember(id: string): Observable<Member> {
    return this.apiService.get<Member>(`${API_PATH}/${id}`).pipe(map((result) => result));
  }

  delete(id: string): Observable<string> {
    return this.apiService.delete(`${API_PATH}/${id}`).pipe(map((result) => result));
  }
}
