import { take } from '@angular/fire/node_modules/rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragEnd, Point } from '@angular/cdk/drag-drop';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Member } from 'src/app/interfaces/會員';
import { MemberService } from 'src/app/services/member/member.service';
import { map, } from 'rxjs/operators';
import { 命盤, 命盤結果, 已作用 } from 'src/app/interfaces/命盤';
import { ExportPdfService, ExportStatus } from 'src/app/services/export-pdf/export-pdf.service';
import { 命盤服務器 } from 'src/app/services/命盤/命盤.service';
import { 算命服務器 } from 'src/app/services/算命/算命.service';
import { ErrorMsg, SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { MAX_YEAR_DISTANCE } from 'src/app/constants/constants';
import { combineLatest } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-member-horoscope',
  templateUrl: './member-horoscope.component.html',
  styleUrls: ['./member-horoscope.component.scss'],
})
export class MemberHoroscopeComponent implements OnInit {
  @ViewChild('pdfTemp') pdfTemplate?: ElementRef;

  member: Member | null = null;
  currentYear: number = new Date().getFullYear();
  minYear: number = 1900;
  maxYear: number = 3000;
  currentHoroscope: 命盤 | null = null;

  isDragging = false;

  pdfButtonPoint: Point = { x: 0, y: 0 };
  exporting = false;

  hasWuXinHint = true;
  chineseZodiac = '';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly exportPdfService: ExportPdfService,
    private readonly 命盤服務: 命盤服務器,
    private readonly 算命服務: 算命服務器,
    private readonly snackBarService: SnackbarService,
    private readonly localStorageService: LocalStorageService,
  ) {
    this.getMemberAndHoroscope();
    this.exportPdfService
      .getExportStatus()
      .pipe(untilDestroyed(this))
      .subscribe((status) => (this.exporting = status === ExportStatus.InProgress));

    this.hasWuXinHint = this.localStorageService.getHasWuXinHint();
  }

  ngOnInit(): void { }

  getMemberAndHoroscope() {
    const getExistedMember = (id: string) => this.memberService.getCurrentMember(id);
    const getMemberFromDb = (id: string) => this.memberService.getMember(id);


    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams
    ]).subscribe(([params, queryParams]) => {
      const id = params.id;
      const year = queryParams.year;

      if (getExistedMember(id)) {
        this.member = new Member(getExistedMember(id));
        this.setYearData(this.member, year);
        this.命盤分析();
      } else {
        getMemberFromDb(id).pipe(take(1)).subscribe(member => {
          if (member) {
            this.member = new Member(member);
            this.setYearData(this.member, year);
            this.命盤分析();
          }
        });
      }
    })
  }

  setYearData(member: Member, year: number) {
    this.currentYear = Number(year);
    this.minYear = member.getDobDate().getFullYear();
    this.maxYear = this.minYear + MAX_YEAR_DISTANCE - 1;
  }

  getYanScoreChanged(result: 命盤結果) {
    return this.localStorageService.getLocalStorageChanged$().pipe(map(() => (this.localStorageService.getHasWuXinHint() ? result.yanScore : result.noHintYanScore) || '無'));
  }

  getYinYanScoreChanged(result: 命盤結果) {
    return this.localStorageService.getLocalStorageChanged$().pipe(map(() => (this.localStorageService.getHasWuXinHint() ? result.yinYanScore : result.noHintYinYanScore) || '無'));
  }

  onAddYear(value: number) {
    this.currentYear = this.currentYear + value;
    this.命盤分析();
  }

  updateYear(value: string) {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      this.snackBarService.showWarning(ErrorMsg.InputNumber);
      return;
    }

    if (this.minYear <= numberValue && numberValue <= this.maxYear) {
      this.currentYear = numberValue;
      this.命盤分析();
    } else {
      this.snackBarService.showWarning(`請輸入${this.minYear}到${this.maxYear}之間的數字`);
    }
  }

  onExportPDF() {
    if (!this.pdfTemplate || !this.member || this.isDragging) {
      this.isDragging = false;
      return;
    }

    this.exportPdfService.exportPdf(this.member?.name, this.currentYear, this.pdfTemplate.nativeElement);
  }

  onCdkDragStart() {
    this.isDragging = true;
  }

  onCkdDragDropped(button: CdkDragEnd<any>, container: HTMLDivElement) {
    const buttonDropX = button.dropPoint.x;
    const buttonDistanceY = this.pdfButtonPoint.y + button.distance.y;
    const buttonDropY = buttonDistanceY + window.scrollY;
    const containerWidth = container.clientWidth;
    const windowHeight = window.innerHeight - 210; // MainHeaderHeight + pageHeaderHeight + buttonHeight

    let newX = buttonDropX > containerWidth / 2 ? containerWidth : 0;
    let newY = buttonDropY < 0 ? 0 : buttonDropY > windowHeight ? windowHeight : buttonDistanceY;

    this.pdfButtonPoint = {
      x: newX,
      y: newY,
    };
  }

  getGanZhiResultClass(result: 已作用) {
    return {
      'combination': result.match,
      'restriction': result.anti,
      'interruption': result.cut
    }
  }

  private 命盤分析() {
    if (!this.member) {
      return;
    }

    const 尋找命盤 = this.命盤服務.取得命盤(this.member.id, this.currentYear)
    if (尋找命盤) {
      this.currentHoroscope = 尋找命盤;
      this.chineseZodiac = this.chineseZodiacConverter(this.currentHoroscope?.chineseZodiac || []);
      return;
    }

    this.currentHoroscope = this.命盤服務.生成特定天干地支命盤(
      this.member.getDobDate(),
      this.currentYear,
      this.member.isMale(),
    );
    this.chineseZodiac = this.chineseZodiacConverter(this.currentHoroscope?.chineseZodiac || []);

    if (this.currentHoroscope) {
      this.算命服務.算命([this.currentHoroscope]);
    } else {
      throw new Error('錯誤的年份或會員資料');
    }
  }

  private chineseZodiacConverter(生肖: string[]) {
    return 生肖.join(',');
  }
}
