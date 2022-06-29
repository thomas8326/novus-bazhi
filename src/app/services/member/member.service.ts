import { Injectable } from '@angular/core';

import { Member } from 'src/app/interfaces/會員';
import { BaseApiService } from 'src/app/services/baseApi/base-api.service';

const API_PATH = 'members';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  private selectMemberList = new Map<string, Member>();

  constructor(private readonly apiService: BaseApiService) { }

  setSelectedMembers(member: Member) {
    this.selectMemberList.set(member.id, member);
  }

  getCurrentMember(id: string) {
    return this.selectMemberList.get(id);
  }

  create(member: Member) {
    this.apiService.post(`${API_PATH}/${member.id}`, member);
  }

  get() {
    return this.apiService.get<Member>(API_PATH);
  }

  replace(id: string, body: object) {
    this.apiService.patch<Member>(`${API_PATH}/${id}`, body)
  }

  getMember(id: string) {
    return this.apiService.getItem<Member>(`${API_PATH}/${id}`);
  }

  delete(id: string) {
    this.apiService.delete(`${API_PATH}/${id}`)
  }

}
