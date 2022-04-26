import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Member } from 'src/app/interfaces/會員';
import { MemberService } from 'src/app/services/member/member.service';
import { switchMap } from 'rxjs/operators';
import { 天干命盤, 地支命盤 } from 'src/app/interfaces/命盤';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-member-horoscope',
  templateUrl: './member-horoscope.component.html',
  styleUrls: ['./member-horoscope.component.scss'],
})
export class MemberHoroscopeComponent implements OnInit {
  member: Member | null = null;
  currentYear: number = new Date().getFullYear();
  yearChangeSubject = new Subject();
  currentGan?: 天干命盤;
  currentZhi?: 地支命盤;

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly memberService: MemberService) {
    this.activatedRoute.params.pipe(switchMap(({ id }) => this.memberService.getMember(id))).subscribe((member) => {
      this.member = member;
      this.updateCurrentGan();
      this.updateCurrentZhi();
    });
  }

  ngOnInit(): void {}

  onAddYear(value: number) {
    this.currentYear = this.currentYear + value;
    this.updateCurrentGan();
    this.updateCurrentZhi();
  }

  updateCurrentGan() {
    this.currentGan = this.member?.horoscope.天干.find((干) => 干.year === this.currentYear);
  }

  updateCurrentZhi() {
    this.currentZhi = this.member?.horoscope.地支.find((支) => 支.year === this.currentYear);
  }
}
