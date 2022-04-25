import { Injectable } from '@angular/core';

import { Member } from 'src/app/interfaces/會員';
import { Observable } from 'rxjs/internal/Observable';
import { BaseApiService } from 'src/app/services/baseApi/base-api.service';
import { ResponseContent } from 'src/app/interfaces/response-content';

const API_PATH = 'members';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  constructor(private readonly apiService: BaseApiService) {}

  create(member: Member): Observable<ResponseContent<Member>> {
    return this.apiService.post(API_PATH, member);
  }
}
