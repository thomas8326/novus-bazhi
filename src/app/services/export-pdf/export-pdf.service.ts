import { Injectable } from '@angular/core';

import { Member } from 'src/app/interfaces/會員';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs/internal/Observable';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Subject } from 'rxjs';
import { ExcelColumn } from 'src/app/enums/會員.enum';

export enum ExportStatus {
  Init = 'init',
  Start = 'start',
  InProgress = 'inProgress',
  Completed = 'completed',
}

const EXCEL_FILE = /(.xls|.xlsx)/;

@Injectable({
  providedIn: 'root',
})
export class ExportPdfService {
  private importStatus = new Subject<ExportStatus>();
  private exportStatus = new Subject<ExportStatus>();

  importPdf(files: FileList | null): Promise<Member[]> {
    return new Promise((resolve, reject) => {
      if (!files || files?.length === 0) {
        return reject('檔案為空');
      }

      let data: object[];
      const isExcelFile = !!files[0].name.match(EXCEL_FILE);

      if (isExcelFile) {
        this.importStatus.next(ExportStatus.InProgress);
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          /* grab first sheet */
          const firstSheetName: string = workbook.SheetNames[0];
          const sheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

          /* save data */
          data = XLSX.utils.sheet_to_json(sheet);
        }

        reader.readAsBinaryString(files[0]);

        reader.onloadend = () => {
          const members: Member[] = [];
          for (let member of data) {
            members.push(this.excelKeyConverter(member));
          }
          this.importStatus.next(ExportStatus.Completed);
          resolve(members);
        }
      }
    });
  }

  exportPdf(member: string, year: number, element: HTMLElement): void {
    this.exportStatus.next(ExportStatus.InProgress);
    const pdfFileName = `${member}-${year}命盤運勢`;
    html2canvas(element).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'px', 'a4');

      const pdfPageWidth = PDF.internal.pageSize.getWidth();
      const pdfPageHeight = PDF.internal.pageSize.getHeight();

      const widthRatio = pdfPageWidth / canvas.width;
      const heightRatio = pdfPageHeight / canvas.height;
      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

      const canvasWidth = canvas.width * ratio;
      const canvasHeight = canvas.height * ratio;

      const marginX = (pdfPageWidth - canvasWidth) / 2;
      const marginY = (pdfPageHeight - canvasHeight) / 2;

      PDF.addImage(image, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
      PDF.save(`${pdfFileName}.pdf`);
      this.exportStatus.next(ExportStatus.Completed);
    });
  }

  getExportStatus(): Observable<ExportStatus> {
    return this.exportStatus;
  }

  getImportStatus(): Observable<ExportStatus> {
    return this.importStatus;
  }

  private excelKeyConverter(data: object) {
    const member = new Member();

    for (let [key, value] of Object.entries(data)) {
      switch (key) {
        case ExcelColumn.Name:
          member.name = value;
          break;
        case ExcelColumn.Gender:
          member.gender = value;
          break;
        case ExcelColumn.DateOfBirth:
          member.dob = value;
          break;
        case ExcelColumn.FacebookAccount:
          member.facebookAccount = value;
          break;
        case ExcelColumn.HandSize:
          member.handSize = value;
          break;
        case ExcelColumn.FortunetellingType:
          member.fortunetellingType = value;
          break;
        case ExcelColumn.AtYear:
          member.atYear = value;
          break;
        case ExcelColumn.Job:
          member.job = value;
          break;
        case ExcelColumn.CrystalStyle:
          member.crystalStyle = value;
          break;
        default:
          throw new Error('出現非預期的欄位: ' + key);
      }
    }
    return member;
  }
}
