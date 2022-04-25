import { TestBed } from '@angular/core/testing';

import { 天干 } from 'src/app/enums/天干.enum';

import { 命盤服務器 } from './命盤.service';

describe('命盤Service', () => {
  let service: 命盤服務器;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [命盤服務器] });
    service = TestBed.inject(命盤服務器);
  });

  describe('test with 天干', () => {
    it('測試命盤結果 with case 1994/11/26 05:12', () => {
      const 命盤 = service.創建基礎命盤(new Date('1994/11/26 05:13'), true);

      expect(命盤.天干本命).toEqual([天干.辛, 天干.丙, 天干.乙, 天干.甲]);
    });

    // TODO: Other testing.
  });
});
