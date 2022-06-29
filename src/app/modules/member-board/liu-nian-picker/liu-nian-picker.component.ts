import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs';
import { 命盤 } from 'src/app/interfaces/命盤';
import { Member } from 'src/app/interfaces/會員';
import { MemberService } from 'src/app/services/member/member.service';
import { 命盤服務器 } from 'src/app/services/命盤/命盤.service';
import { 算命服務器 } from 'src/app/services/算命/算命.service';

@Component({
  selector: 'app-liu-nian-picker',
  templateUrl: './liu-nian-picker.component.html',
  styleUrls: ['./liu-nian-picker.component.scss']
})
export class LiuNianPickerComponent {

  member: Member | null = null;
  currentYear: number = new Date().getFullYear();

  horoscopeList: 命盤[] = [];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly 命盤服務: 命盤服務器,
    private readonly 算命服務: 算命服務器
  ) {
    this.activatedRoute.params.pipe(switchMap(({ id }) => this.memberService.getMember(id))).subscribe((member) => {
      if (member) {
        this.member = new Member(member);
        this.currentYear = isNaN(this.member.atYear) ? this.currentYear : this.member.atYear;
        for (let i = this.currentYear - 1; i <= this.currentYear + 1; i++) {
          this.horoscopeList.push(this.命盤分析(this.member, i));
        }
        this.命盤服務.新增命盤(this.member.id, this.horoscopeList);
        this.memberService.setSelectedMembers(this.member);
      }
    });
  }

  onRedirectToResult(year: number) {
    if (this.member) {
      this.router.navigate([`result`], { relativeTo: this.activatedRoute, queryParams: { year } });
    }
  }

  private 命盤分析(member: Member, year: number) {
    const currentHoroscope = this.命盤服務.生成特定天干地支命盤(
      member.getDobDate(),
      year,
      member.isMale(),
    );

    if (currentHoroscope) {
      this.算命服務.算命([currentHoroscope]);
      return currentHoroscope;
    } else {
      throw new Error('錯誤的年份或會員資料');
    }
  }
}
