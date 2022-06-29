import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map, switchMap } from 'rxjs';
import { 命盤, 命盤結果, 已作用 } from 'src/app/interfaces/命盤';
import { Member } from 'src/app/interfaces/會員';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { MemberService } from 'src/app/services/member/member.service';
import { 命盤服務器 } from 'src/app/services/命盤/命盤.service';
import { 算命服務器 } from 'src/app/services/算命/算命.service';

@Component({
  selector: 'app-horoscope-table',
  templateUrl: './horoscope-table.component.html',
  styleUrls: ['./horoscope-table.component.scss']
})
export class HoroscopeTableComponent implements OnInit {

  @Input() currentHoroscope: 命盤 | null = null;
  @Input() currentYear: number = new Date().getFullYear();

  member: Member | null = null;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly 算命服務: 算命服務器,
    private readonly 命盤服務: 命盤服務器,
    private readonly localStorageService: LocalStorageService,
  ) {

  }

  ngOnInit(): void {
    if (!this.currentHoroscope) {
      this.activatedRoute.params.pipe(switchMap(({ id }) => this.memberService.getMember(id))).subscribe((member) => {
        if (member) {
          this.member = new Member(member);
          this.currentYear = isNaN(this.member.atYear) ? this.currentYear : this.member.atYear;
          this.命盤分析();
        }
      });
    }
  }

  getGanZhiResultClass(result: 已作用) {
    return {
      'combination': result.match,
      'restriction': result.anti,
      'interruption': result.cut
    }
  }

  getYanScoreChanged(result: 命盤結果) {
    return this.localStorageService.getLocalStorageChanged$().pipe(map(() => (this.localStorageService.getHasWuXinHint() ? result.yanScore : result.noHintYanScore) || '無'));
  }

  getYinYanScoreChanged(result: 命盤結果) {
    return this.localStorageService.getLocalStorageChanged$().pipe(map(() => (this.localStorageService.getHasWuXinHint() ? result.yinYanScore : result.noHintYinYanScore) || '無'));
  }

  private 命盤分析() {
    if (!this.member) {
      return;
    }

    this.currentHoroscope = this.命盤服務.生成特定天干地支命盤(
      this.member.getDobDate(),
      this.currentYear,
      this.member.isMale(),
    );

    if (this.currentHoroscope) {
      this.算命服務.算命([this.currentHoroscope]);

    } else {
      throw new Error('錯誤的年份或會員資料');
    }
  }

}
