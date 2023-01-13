import { TestBed } from '@angular/core/testing';

import { 天干 } from 'src/app/enums/天干.enum';
import { 創造劫數對照表, 命盤, 命盤結果, 地支命盤, 天干命盤, 已作用 } from 'src/app/interfaces/命盤';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 命盤測試, 算命測試 } from 'src/app/services/算命/算命測試';

import TestCases from './test-cases.json';
import { 算命服務器 } from './算命.service';

describe('FortuneTellingService', () => {
  let service: 算命服務器;

  const testCases: 算命測試 = JSON.parse(JSON.stringify(TestCases));

  const 合案例: 已作用 = {
    match: true,
    anti: false,
    cut: false,
  };

  const 剋案例: 已作用 = {
    match: false,
    anti: true,
    cut: false,
  };

  const 未合案例: 已作用 = {
    match: false,
    anti: false,
    cut: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [算命服務器] });
    service = TestBed.inject(算命服務器);
  });

  function 創建測試命盤(測試命盤: 命盤測試): 命盤 {
    const 測試案例 = 測試命盤.命盤;
    return new 命盤({
      year: 2022,
      myFateSet: { gan: 測試案例.天干.本命, zhi: 測試案例.地支.本命 },
      bigFortune: { gan: 測試案例.天干.大運, zhi: 測試案例.地支.大運 },
      yearFortune: { gan: 測試案例.天干.流年, zhi: 測試案例.地支.流年 },
      monthFortune: [],
      chineseZodiac: [],
    });
  }

  describe('test with test cases', () => {
    function testAmountOfCasesWithGanZhi(測試: 命盤測試) {
      it(`測試案例 =>
          姓名: ${測試.姓名} ||
          天干: ${測試.命盤.天干.本命.join('')}, ${測試.命盤.天干.大運}${測試.命盤.天干.流年} ||
          地支: ${測試.命盤.地支.本命.join('')}, ${測試.命盤.地支.大運}${測試.命盤.地支.流年} ||
          `, () => {
        const 測試案例 = 創建測試命盤(測試);

        service.算命([測試案例]);

        expect(測試案例.horoscopeResult.gan.reaction).toEqual(jasmine.objectContaining(測試.預期.天干));
        expect(測試案例.horoscopeResult.zhi.reaction).toEqual(jasmine.objectContaining(測試.預期.地支));
        測試.評分.天干.forEach(value =>
          expect(測試案例.horoscopeResult.gan.scores.find(score => score.includes(value))).toBeTruthy());
        測試.評分.地支.forEach(value => expect(測試案例.horoscopeResult.zhi.scores.find(score => score.includes(value))).toBeTruthy());
      });
    }

    for (const test of testCases.命盤測試) {
      testAmountOfCasesWithGanZhi(test);
    }
  });

  describe('test with 流通結果', () => {
    function testAmountOfCasesWithGanZhi(測試: 命盤測試) {
      it(`測試案例 =>
          姓名: ${測試.姓名} ||
          天干: ${測試.命盤.天干.本命.join('')}, ${測試.命盤.天干.大運}${測試.命盤.天干.流年} ||
          地支: ${測試.命盤.地支.本命.join('')}, ${測試.命盤.地支.大運}${測試.命盤.地支.流年} ||
          `, () => {
        const 測試案例 = 創建測試命盤(測試);

        service.算命([測試案例]);

        expect(測試案例.horoscopeResult.gan.noHintYinYanScore).toEqual(測試.流通?.天干 ?? '');
        expect(測試案例.horoscopeResult.zhi.noHintYinYanScore).toEqual(測試.流通?.地支 ?? '');
      });
    }

    for (const test of testCases.流通結果測試) {
      testAmountOfCasesWithGanZhi(test);
    }
  });

  describe(`test with 天干`, () => {
    function 創建測試天干命盤(本命: 天干[], 大運: 天干, 流年: 天干, 流月?: 天干): 天干命盤 {
      return {
        year: 2022,
        horoscopeResult: new 命盤結果(true),
        myFateSet: 本命,
        bigFortune: 大運,
        yearFortune: 流年,
        monthFortune: 流月,
      };
    }

    it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙辛', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.辛);

      service.設定天干日柱(天干.庚);
      service.設定劫數對照表(創造劫數對照表(天干.庚).badPropertyMapping)
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 未合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 合案例,
          [命盤結果屬性.yearFortune]: 合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙壬', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.壬);

      service.設定天干日柱(天干.庚);
      service.設定劫數對照表(創造劫數對照表(天干.庚).badPropertyMapping)

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 未合案例,
          [命盤結果屬性.yearFortune]: 合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙癸', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.癸);

      service.設定天干日柱(天干.庚);
      service.設定劫數對照表(創造劫數對照表(天干.庚).badPropertyMapping)
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 未合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 未合案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('大運流年若有合的字，則在本命中相同的字同樣會消失 with case 丁己辛甲 | 甲己', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.己, 天干.辛, 天干.甲], 天干.甲, 天干.己);

      service.設定天干日柱(天干.己);
      service.設定劫數對照表(創造劫數對照表(天干.庚).badPropertyMapping)
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 未合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 合案例,
          [命盤結果屬性.yearFortune]: 合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('大運流年若跟本命有合的字，則在本命中相同的字同樣會消失 with case 己己丙甲 | 甲丙', () => {
      const 測試案例 = 創建測試天干命盤([天干.己, 天干.己, 天干.丙, 天干.甲], 天干.甲, 天干.丙);

      service.設定天干日柱(天干.己);
      service.設定劫數對照表(創造劫數對照表(天干.庚).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 合案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('本命有合也算消失間隔 with case 丁丙丙壬 | 辛庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.丙, 天干.丙, 天干.壬], 天干.辛, 天干.庚);

      service.設定天干日柱(天干.丙);
      service.設定劫數對照表(創造劫數對照表(天干.丙).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 合案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('若是流年有相剋，也先看是否有本命可以先合 with case 丁癸癸辛 | 丙庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.癸, 天干.癸, 天干.辛], 天干.丙, 天干.庚);

      service.設定天干日柱(天干.癸);
      service.設定劫數對照表(創造劫數對照表(天干.癸).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 未合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 合案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('大運流年若有相剋的字，相剋成功則在本命中相同的字同樣會消失 with case 庚戊己庚 | 丙庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.庚, 天干.戊, 天干.己, 天干.庚], 天干.丙, 天干.庚);

      service.設定天干日柱(天干.戊);
      service.設定劫數對照表(創造劫數對照表(天干.戊).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 剋案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 剋案例,
          [命盤結果屬性.bigFortune]: 未合案例,
          [命盤結果屬性.yearFortune]: 剋案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('大運流年兩字相同算一字 with case 乙甲壬丁 | 庚庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.乙, 天干.甲, 天干.壬, 天干.丁], 天干.庚, 天干.庚);

      service.設定天干日柱(天干.甲);
      service.設定劫數對照表(創造劫數對照表(天干.甲).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 合案例,
          [命盤結果屬性.yearFortune]: 合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('流年剋大運，解合 with case 丁癸乙壬 | 壬戊', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.癸, 天干.乙, 天干.壬], 天干.壬, 天干.戊);

      service.設定天干日柱(天干.癸);
      service.設定劫數對照表(創造劫數對照表(天干.癸).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 未合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 剋案例,
          [命盤結果屬性.bigFortune]: 剋案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('大運剋流年，未解合 with case 丁癸乙壬 | 戊壬', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.癸, 天干.乙, 天干.壬], 天干.戊, 天干.壬);

      service.設定天干日柱(天干.癸);
      service.設定劫數對照表(創造劫數對照表(天干.癸).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 未合案例,
          [命盤結果屬性.yearFortune]: 合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('大運流年相剋，本命中找尋是否有遭剋的字前後五行可以相救，不能救 with case 丙丁辛丁 | 甲庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.丙, 天干.丁, 天干.辛, 天干.丁], 天干.甲, 天干.庚);

      service.設定天干日柱(天干.丁);
      service.設定劫數對照表(創造劫數對照表(天干.丁).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 合案例,
          [命盤結果屬性.year]: 未合案例,
          [命盤結果屬性.bigFortune]: 剋案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('大運流年相剋，本命中找尋是否有遭剋的字前後五行可以相救，可以救 with case 丙丁辛壬 | 甲庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.丙, 天干.丁, 天干.辛, 天干.壬], 天干.甲, 天干.庚);

      service.設定天干日柱(天干.丁);
      service.設定劫數對照表(創造劫數對照表(天干.丁).badPropertyMapping);
      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 合案例,
          [命盤結果屬性.year]: 未合案例,
          [命盤結果屬性.bigFortune]: 未合案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });
  });

  describe('test with 地支', () => {
    function 創建測試地支命盤(本命: 地支[], 大運: 地支, 流年: 地支, 流月?: 地支): 地支命盤 {
      return {
        year: 2022,
        horoscopeResult: new 命盤結果(false),
        myFateSet: 本命,
        bigFortune: 大運,
        yearFortune: 流年,
        monthFortune: 流月,
      };
    }

    it('should return correct result when calling function of 算地支 with case 亥午丑辰 | 申丑', () => {
      const 測試案例 = 創建測試地支命盤([地支.亥, 地支.午, 地支.丑, 地支.辰], 地支.申, 地支.丑);

      service.設定天干日柱(天干.甲);
      service.設定劫數對照表(創造劫數對照表(天干.甲).badPropertyMapping);
      service.算地支(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 未合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 未合案例,
          [命盤結果屬性.bigFortune]: 未合案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('should return correct result when calling function of 算地支 with case 亥午丑辰 | 申寅', () => {
      const 測試案例 = 創建測試地支命盤([地支.亥, 地支.午, 地支.丑, 地支.辰], 地支.申, 地支.寅);

      service.設定天干日柱(天干.甲);
      service.設定劫數對照表(創造劫數對照表(天干.甲).badPropertyMapping);
      service.算地支(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 未合案例,
          [命盤結果屬性.bigFortune]: 未合案例,
          [命盤結果屬性.yearFortune]: 合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('should return correct result when calling function of 算地支 with case 亥午丑辰 | 申卯', () => {
      const 測試案例 = 創建測試地支命盤([地支.亥, 地支.午, 地支.丑, 地支.辰], 地支.申, 地支.卯);

      service.設定天干日柱(天干.甲);
      service.設定劫數對照表(創造劫數對照表(天干.甲).badPropertyMapping);
      service.算地支(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 未合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 未合案例,
          [命盤結果屬性.bigFortune]: 未合案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });

    it('should return correct result when calling function of 算地支 with case 子寅寅申 | 巳子', () => {
      const 測試案例 = 創建測試地支命盤([地支.子, 地支.寅, 地支.寅, 地支.申], 地支.巳, 地支.子);

      service.設定天干日柱(天干.甲);
      service.設定劫數對照表(創造劫數對照表(天干.甲).badPropertyMapping);
      service.算地支(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual(
        jasmine.objectContaining({
          [命盤結果屬性.time]: 未合案例,
          [命盤結果屬性.day]: 未合案例,
          [命盤結果屬性.month]: 未合案例,
          [命盤結果屬性.year]: 合案例,
          [命盤結果屬性.bigFortune]: 合案例,
          [命盤結果屬性.yearFortune]: 未合案例,
          [命盤結果屬性.monthFortune]: 未合案例,
        }),
      );
    });
  });
});
