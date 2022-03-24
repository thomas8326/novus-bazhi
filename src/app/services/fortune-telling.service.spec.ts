import { 天干 } from 'src/app/enums/天干.enum';
import { TestBed } from '@angular/core/testing';
import { 天干命盤 } from 'src/app/interfaces/命盤';

import { FortuneTellingService } from './fortune-telling.service';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';

describe('FortuneTellingService', () => {
  let service: FortuneTellingService;

  function 創建測試天干命盤(本命: 天干[], 大運: 天干, 流年: 天干): 天干命盤 {
    return {
      命盤結果: {
        [命盤結果屬性.時住已合]: false,
        [命盤結果屬性.日住已合]: false,
        [命盤結果屬性.月住已合]: false,
        [命盤結果屬性.年住已合]: false,
        [命盤結果屬性.大運已合]: false,
        [命盤結果屬性.流年已合]: false,
      },
      本命,
      大運,
      流年,
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FortuneTellingService] });
    service = TestBed.inject(FortuneTellingService);
  });

  it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙辛', () => {
    const 天干案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.辛);

    service.算天干(天干案例);

    expect(天干案例.命盤結果).toEqual({
      [命盤結果屬性.時住已合]: false,
      [命盤結果屬性.日住已合]: false,
      [命盤結果屬性.月住已合]: true,
      [命盤結果屬性.年住已合]: true,
      [命盤結果屬性.大運已合]: true,
      [命盤結果屬性.流年已合]: true,
    });
  });

  it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙壬', () => {
    const 天干案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.壬);

    service.算天干(天干案例);

    expect(天干案例.命盤結果).toEqual({
      [命盤結果屬性.時住已合]: true,
      [命盤結果屬性.日住已合]: false,
      [命盤結果屬性.月住已合]: true,
      [命盤結果屬性.年住已合]: true,
      [命盤結果屬性.大運已合]: false,
      [命盤結果屬性.流年已合]: true,
    });
  });

  it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙癸', () => {
    const 天干案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.癸);

    service.算天干(天干案例);

    expect(天干案例.命盤結果).toEqual({
      [命盤結果屬性.時住已合]: false,
      [命盤結果屬性.日住已合]: false,
      [命盤結果屬性.月住已合]: true,
      [命盤結果屬性.年住已合]: true,
      [命盤結果屬性.大運已合]: false,
      [命盤結果屬性.流年已合]: false,
    });
  });
});
