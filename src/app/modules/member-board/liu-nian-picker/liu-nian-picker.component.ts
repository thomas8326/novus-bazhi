import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('pdfContainer') set setPdfTemplate(template: ElementRef | undefined) {
    if (template) {
      this.pdfTemplate = template;
      this.setupPdfTemplate();
    }
  }


  member: Member | null = null;
  currentYear: number = new Date().getFullYear();
  atYear = 0;

  windowStart = 0;
  windowEnd = 0;
  windowRange = 2;

  minYear = 0;
  maxYear = 0;
  horoscopeList: 命盤[] = [];

  exporting$: Observable<boolean>;

  pdfTemplate?: ElementRef;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly 命盤服務: 命盤服務器,
    private readonly 算命服務: 算命服務器,
    private readonly exportPdfService: ExportPdfService,
  ) {
    this.exporting$ = this.exportPdfService.getExporting();

    this.activatedRoute.params.pipe(switchMap(({ id }) => this.memberService.getMember(id))).subscribe((member) => {
      if (member) {
        this.member = new Member(member);
        this.currentYear = isNaN(this.member.atYear) ? this.currentYear : this.member.atYear;
        this.atYear = this.currentYear;
        for (let i = this.currentYear - 1; i <= this.currentYear + 1; i++) {
          this.horoscopeList.push(this.命盤分析(this.member, i));
        }
        this.windowStart = 0;
        this.windowEnd = this.horoscopeList.length - 1;

        this.命盤服務.新增命盤(this.member.id, this.horoscopeList);
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

    const 第一個命盤 = this.horoscopeList[this.windowStart];
    this.windowStart = this.windowStart - 1;

    if (this.windowStart < 0) {
      this.windowStart = 0;
      const 新命盤 = this.命盤分析(this.member, 第一個命盤.year - 1);
      this.horoscopeList.unshift(新命盤);
      this.命盤服務.新增命盤(this.member.id, [新命盤]);
    }

    this.windowEnd = this.windowStart + this.windowRange;
  }

  onNextYear() {
    if (!this.member) {
      return;
    }

    const 最後一個命盤 = this.horoscopeList[this.windowEnd];
    this.windowStart++;
    this.windowEnd = this.windowStart + this.windowRange;

    if (this.windowEnd >= this.horoscopeList.length) {
      const 新命盤 = this.命盤分析(this.member, 最後一個命盤.year + 1);
      this.horoscopeList.push(新命盤);
      this.命盤服務.新增命盤(this.member.id, [新命盤]);
    }
  }

  displayHoroscopeList() {
    return this.horoscopeList.filter((value, index) => index >= this.windowStart && index <= this.windowEnd);
  }

  private setupPdfTemplate() {
    if (!this.pdfTemplate || !this.member) {
      return;
    }

    const firstYear = this.horoscopeList[this.windowStart].year;
    const lastYear = this.horoscopeList[this.windowEnd].year;
    const fileName = `${firstYear} - ${lastYear} ${this.member.name}`
    this.exportPdfService.setExportPdfConfig(this.pdfTemplate.nativeElement, fileName);
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
