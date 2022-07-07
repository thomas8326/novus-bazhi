import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap, Observable } from 'rxjs';
import { MAX_YEAR_DISTANCE } from 'src/app/constants/constants';
import { 命盤 } from 'src/app/interfaces/命盤';
import { Member } from 'src/app/interfaces/會員';
import { ExportPdfService } from 'src/app/services/export-pdf/export-pdf.service';
import { MemberService } from 'src/app/services/member/member.service';
import { 命盤服務器 } from 'src/app/services/命盤/命盤.service';
import { 算命服務器 } from 'src/app/services/算命/算命.service';

@Component({
  selector: 'app-liu-nian-picker',
  templateUrl: './liu-nian-picker.component.html',
  styleUrls: ['./liu-nian-picker.component.scss']
})
export class LiuNianPickerComponent {

  @ViewChild('pdfContainer') pdfTemplate?: ElementRef;

  member: Member | null = null;
  currentYear: number = new Date().getFullYear();
  atYear = 0;
  currentIndex = 0;
  minYear = 0;
  maxYear = 0;
  horoscopeList: 命盤[][] = [];

  exporting$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly 命盤服務: 命盤服務器,
    private readonly 算命服務: 算命服務器,
    private readonly exportPdfService: ExportPdfService,
    private readonly renderer2: Renderer2
  ) {
    this.exporting$ = this.exportPdfService.getExporting();

    this.activatedRoute.params.pipe(switchMap(({ id }) => this.memberService.getMember(id))).subscribe((member) => {
      if (member) {
        this.member = new Member(member);
        this.currentYear = isNaN(this.member.atYear) ? this.currentYear : this.member.atYear;
        this.atYear = this.currentYear;
        const horoscopes: 命盤[] = [];
        for (let i = this.currentYear - 1; i <= this.currentYear + 1; i++) {
          horoscopes.push(this.命盤分析(this.member, i));
        }
        this.horoscopeList.push(horoscopes);
        this.命盤服務.新增命盤(this.member.id, horoscopes);
        this.memberService.setSelectedMembers(this.member);
        this.minYear = this.member.getDobDate().getFullYear();
        this.maxYear = this.minYear + MAX_YEAR_DISTANCE - 1;
      }
    });
  }

  onRedirectToResult(year: number) {
    if (this.member) {
      this.router.navigate([`result`], { relativeTo: this.activatedRoute, queryParams: { year } });
    }
  }

  onPrevYear() {
    if (!this.member) {
      return;
    }

    this.currentIndex = this.currentIndex - 1;
    this.currentYear = this.currentYear - 3;

    if (this.currentIndex >= 0) {
      return;
    }

    this.currentIndex = 0;
    const horoscopes: 命盤[] = [];
    for (let i = this.currentYear - 1; i <= this.currentYear + 1; i++) {
      horoscopes.push(this.命盤分析(this.member, i));
    }
    this.horoscopeList.unshift(horoscopes);
    this.命盤服務.新增命盤(this.member.id, horoscopes);
  }

  onNextYear() {
    if (!this.member) {
      return;
    }

    this.currentIndex = this.currentIndex + 1;
    this.currentYear = this.currentYear + 3;

    if (this.currentIndex < this.horoscopeList.length) {
      return;
    }

    const horoscopes: 命盤[] = [];
    for (let i = this.currentYear - 1; i <= this.currentYear + 1; i++) {
      horoscopes.push(this.命盤分析(this.member, i));
    }
    this.horoscopeList.push(horoscopes);
    this.命盤服務.新增命盤(this.member.id, horoscopes);
  }

  onExportPDF(pdfContainer: HTMLDivElement, button: MatButton, year: number) {
    if (!pdfContainer || !this.member) {
      return;
    }

    this.renderer2.setStyle(button._elementRef.nativeElement, "visibility", "hidden");
    this.exportPdfService.exportPdf(this.member?.name, year, pdfContainer);
    this.renderer2.setStyle(button._elementRef.nativeElement, "visibility", "visible");
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
