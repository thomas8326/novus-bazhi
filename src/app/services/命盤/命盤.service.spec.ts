import { TestBed } from '@angular/core/testing';

import { 命盤服務器 } from './命盤.service';
import { 天干 } from 'src/app/enums/天干.enum';

describe('命盤Service', () => {
  let service: 命盤服務器;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [命盤服務器] });
    service = TestBed.inject(命盤服務器);
  });

  describe('test with 天干', () => {
    it('測試命盤結果 with case 1994/11/26 05:12', () => {
      const 測試天干命盤 = service.創建天干命盤(new Date('1994/11/26 05:13'), true);

      console.log(測試天干命盤);

      expect(測試天干命盤.本命).toEqual([天干.辛, 天干.丙, 天干.乙, 天干.甲]);
    });

    // TODO: Other testing.
  });
});
