import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class ExportPdfService {
  exportPdf(member: string, year: number, element: HTMLElement): void {
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
    });
  }
}
