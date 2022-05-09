import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { 五行 } from 'src/app/enums/五行.enum';
import { Member } from 'src/app/interfaces/會員';
import { MemberService } from 'src/app/services/member/member.service';
import { switchMap } from 'rxjs/operators';
import { 命盤 } from 'src/app/interfaces/命盤';
import { Subject } from 'rxjs';
import { ExportPdfService } from 'src/app/services/export-pdf/export-pdf.service';

@Component({
  selector: 'app-member-horoscope',
  templateUrl: './member-horoscope.component.html',
  styleUrls: ['./member-horoscope.component.scss'],
})
export class MemberHoroscopeComponent implements OnInit {
  @ViewChild('pdfTemp') pdfTemplate?: ElementRef;

  member: Member | null = null;
  currentYear: number = new Date().getFullYear();
  yearChangeSubject = new Subject();
  minYear: number = 1900;
  maxYear: number = 3000;
  currentHoroscope?: 命盤;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly exportPdfService: ExportPdfService,
  ) {
    this.activatedRoute.params.pipe(switchMap(({ id }) => this.memberService.getMember(id))).subscribe((member) => {
      this.member = member;
      this.minYear = new Date(member.dob).getFullYear();
      this.maxYear = this.minYear + member.horoscope.length - 1;
      this.updateHoroscope();
    });
  }

  ngOnInit(): void {}

  onAddYear(value: number) {
    this.currentYear = this.currentYear + value;
    this.updateHoroscope();
  }

  updateHoroscope() {
    this.currentHoroscope = this.member?.horoscope.find(({ year }) => year === this.currentYear);
  }

  updateYear(value: string) {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      // NaN Handle
      return;
    }

    if (this.minYear <= numberValue && numberValue <= this.maxYear) {
      this.currentYear = numberValue;
      this.updateHoroscope();
    } else {
      // TODO: Error Handle.
    }
  }

  badProperty(目標五行?: 五行) {
    if (!this.currentHoroscope?.劫數對照表) {
      return '';
    }

    return 目標五行 ? `(破${this.currentHoroscope.劫數對照表[目標五行]})` : '';
  }

  convertLiuYueScores(data: { value: string; property?: 五行 }[]) {
    if (!this.currentHoroscope?.劫數對照表) {
      return '';
    }

    return data.map((score) => `${score.value} ${this.badProperty(score.property)}`).join(', ');
  }

  onExportPDF() {
    if (!this.pdfTemplate || !this.member) {
      return;
    }

    this.exportPdfService.exportPdf(this.member?.name, this.currentYear, this.pdfTemplate.nativeElement);
  }
}
