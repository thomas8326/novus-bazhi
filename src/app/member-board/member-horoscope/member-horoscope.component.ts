import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';
import { Member } from 'src/app/interfaces/會員';
import { MemberService } from 'src/app/services/member/member.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-member-horoscope',
  templateUrl: './member-horoscope.component.html',
  styleUrls: ['./member-horoscope.component.scss'],
})
export class MemberHoroscopeComponent implements OnInit {
  member$: Observable<Member | null> = of(null);

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly memberService: MemberService) {
    this.activatedRoute.params.subscribe(({ id }) => (this.member$ = this.memberService.getMember(id)));
  }

  ngOnInit(): void {}
}
