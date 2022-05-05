import { TestBed } from '@angular/core/testing';

import { 天干 } from 'src/app/enums/天干.enum';
import { 命盤結果, 地支命盤, 天干命盤 } from 'src/app/interfaces/命盤';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 地支測試, 天干測試, 算命測試 } from 'src/app/services/算命/算命測試';

import TestCases from './test-cases.json';
import { 算命服務器 } from './算命.service';

describe('FortuneTellingService', () => {
  let service: 算命服務器;

  const testCases: 算命測試 = JSON.parse(JSON.stringify(TestCases));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [算命服務器] });
    service = TestBed.inject(算命服務器);
  });

  function 創建測試天干命盤(本命: 天干[], 大運: 天干, 流年: 天干): 天干命盤 {
    return {
      year: 2022,
      horoscopeResult: new 命盤結果(true),
      myFateSet: 本命,
      bigFortune: 大運,
      yearFortune: 流年,
      liuYue: [],
    };
  }

  function 創建測試地支命盤(本命: 地支[], 大運: 地支, 流年: 地支): 地支命盤 {
    return {
      year: 2022,
      horoscopeResult: new 命盤結果(false),
      myFateSet: 本命,
      bigFortune: 大運,
      yearFortune: 流年,
      liuYue: [],
    };
  }

  describe('test with test cases', () => {
    function testAmountOfCasesWithGan(測試: 天干測試) {
      it(`測試案例 => ${測試.命盤.本命.join('')} | ${測試.命盤.大運}${測試.命盤.流年}`, () => {
        const 測試案例 = 創建測試天干命盤(測試.命盤.本命, 測試.命盤.大運, 測試.命盤.流年);

        service.算天干(測試案例);

        expect(測試案例.horoscopeResult.reaction).toEqual(測試.預期);
        expect(測試案例.horoscopeResult.scores.sort()).toEqual(測試.評分.sort());
      });
    }

    function testAmountOfCasesWithZhi(測試: 地支測試) {
      it(`測試案例 => ${測試.命盤.本命.join('')} | ${測試.命盤.大運}${測試.命盤.流年}`, () => {
        const 測試案例 = 創建測試地支命盤(測試.命盤.本命, 測試.命盤.大運, 測試.命盤.流年);

        service.算地支(測試案例);

        expect(測試案例.horoscopeResult.reaction).toEqual(測試.預期);
        expect(測試案例.horoscopeResult.scores.sort()).toEqual(測試.評分.sort());
      });
    }

    for (const test of testCases.天干測試) {
      testAmountOfCasesWithGan(test);
    }

    for (const test of testCases.地支測試) {
      testAmountOfCasesWithZhi(test);
    }
  });

  describe(`test with 天干`, () => {
    it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙辛', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.辛);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: false,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: true,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: true,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙壬', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.壬);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: true,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: false,
        [命盤結果屬性.流年已作用]: true,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('should return correct result when calling function of 算天干 with case 丁庚辛丙 | 丙癸', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.庚, 天干.辛, 天干.丙], 天干.丙, 天干.癸);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: false,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: true,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: false,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('大運流年若有合的字，則在本命中相同的字同樣會消失 with case 丁己辛甲 | 甲己', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.己, 天干.辛, 天干.甲], 天干.甲, 天干.己);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: false,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: true,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('大運流年若跟本命有合的字，則在本命中相同的字同樣會消失 with case 己己丙甲 | 甲丙', () => {
      const 測試案例 = 創建測試天干命盤([天干.己, 天干.己, 天干.丙, 天干.甲], 天干.甲, 天干.丙);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('本命有合也算消失間隔 with case 丁丙丙壬 | 辛庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.丙, 天干.丙, 天干.壬], 天干.辛, 天干.庚);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: true,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('若是流年有相剋，也先看是否有本命可以先合 with case 丁癸癸辛 | 丙庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.癸, 天干.癸, 天干.辛], 天干.丙, 天干.庚);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: false,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('大運流年若有相剋的字，相剋成功則在本命中相同的字同樣會消失 with case 庚戊己庚 | 丙庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.庚, 天干.戊, 天干.己, 天干.庚], 天干.丙, 天干.庚);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: false,
        [命盤結果屬性.流年已作用]: true,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: true,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('大運流年兩字相同算一字 with case 乙甲壬丁 | 庚庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.乙, 天干.甲, 天干.壬, 天干.丁], 天干.庚, 天干.庚);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: true,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: true,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('流年剋大運，解合 with case 丁癸乙壬 | 壬戊', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.癸, 天干.乙, 天干.壬], 天干.壬, 天干.戊);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: false,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: true,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('大運剋流年，未解合 with case 丁癸乙壬 | 戊壬', () => {
      const 測試案例 = 創建測試天干命盤([天干.丁, 天干.癸, 天干.乙, 天干.壬], 天干.戊, 天干.壬);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: false,
        [命盤結果屬性.流年已作用]: true,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('大運流年相剋，本命中找尋是否有遭剋的字前後五行可以相救，不能救 with case 丙丁辛丁 | 甲庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.丙, 天干.丁, 天干.辛, 天干.丁], 天干.甲, 天干.庚);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: true,
        [命盤結果屬性.年住已作用]: false,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: true,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('大運流年相剋，本命中找尋是否有遭剋的字前後五行可以相救，可以救 with case 丙丁辛壬 | 甲庚', () => {
      const 測試案例 = 創建測試天干命盤([天干.丙, 天干.丁, 天干.辛, 天干.壬], 天干.甲, 天干.庚);

      service.算天干(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: true,
        [命盤結果屬性.年住已作用]: false,
        [命盤結果屬性.大運已作用]: false,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });
  });

  describe('test with 地支', () => {
    it('should return correct result when calling function of 算地支 with case 亥午丑辰 | 申丑', () => {
      const 測試案例 = 創建測試地支命盤([地支.亥, 地支.午, 地支.丑, 地支.辰], 地支.申, 地支.丑);

      service.算地支(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: false,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: false,
        [命盤結果屬性.大運已作用]: false,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('should return correct result when calling function of 算地支 with case 亥午丑辰 | 申寅', () => {
      const 測試案例 = 創建測試地支命盤([地支.亥, 地支.午, 地支.丑, 地支.辰], 地支.申, 地支.寅);

      service.算地支(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: true,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: false,
        [命盤結果屬性.大運已作用]: false,
        [命盤結果屬性.流年已作用]: true,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('should return correct result when calling function of 算地支 with case 亥午丑辰 | 申卯', () => {
      const 測試案例 = 創建測試地支命盤([地支.亥, 地支.午, 地支.丑, 地支.辰], 地支.申, 地支.卯);

      service.算地支(測試案例);

      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: false,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: false,
        [命盤結果屬性.大運已作用]: false,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });

    it('should return correct result when calling function of 算地支 with case 子寅寅申 | 巳子', () => {
      const 測試案例 = 創建測試地支命盤([地支.子, 地支.寅, 地支.寅, 地支.申], 地支.巳, 地支.子);
      service.算地支(測試案例);
      expect(測試案例.horoscopeResult.reaction).toEqual({
        [命盤結果屬性.時住已作用]: false,
        [命盤結果屬性.日住已作用]: false,
        [命盤結果屬性.月住已作用]: false,
        [命盤結果屬性.年住已作用]: true,
        [命盤結果屬性.大運已作用]: true,
        [命盤結果屬性.流年已作用]: false,
        [命盤結果屬性.流月已作用]: false,
        [命盤結果屬性.大運被剋]: false,
        [命盤結果屬性.流年被剋]: false,
        [命盤結果屬性.流年斷氣]: false,
        [命盤結果屬性.流月被剋]: false,
      });
    });
  });
});
