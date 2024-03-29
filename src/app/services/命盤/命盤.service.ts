import { Injectable } from '@angular/core';

import { 天干對照表, 地支對照表 } from 'src/app/constants/constants';
import { 命盤 } from 'src/app/interfaces/命盤';
import { EightChar, Solar } from 'lunar-typescript';
import { 大運 } from 'src/app/interfaces/大運';
import { cn2tw } from 'cjk-conv';

@Injectable({
  providedIn: 'root',
})
export class 命盤服務器 {
  private readonly horoscopeSet = new Map<string, Map<number, 命盤>>();

  取得命盤(memberId: string, year: number) {
    return this.horoscopeSet.get(memberId)?.get(year) || null;
  }

  新增命盤(memberId: string, horoscopeList: 命盤[]) {
    const map = this.horoscopeSet.get(memberId);
    if (map) {
      for (const scope of horoscopeList) {
        map.set(scope.year, scope);
      }

      this.horoscopeSet.set(memberId, map);
      return;
    }

    const newMap = new Map<number, 命盤>();
    for (const scope of horoscopeList) {
      newMap.set(scope.year, scope);
    }

    this.horoscopeSet.set(memberId, newMap);
  }


  創建基礎命盤(dob: Date, isMale?: boolean) {
    const solar = Solar.fromDate(dob)
    const lunar = solar.getLunar();
    const 八字 = EightChar.fromLunar(Solar.fromDate(dob).getLunar());

    const 天干本命 = [
      天干對照表.get(八字.getTimeGan())!,
      天干對照表.get(八字.getDayGan())!,
      天干對照表.get(八字.getMonthGan())!,
      天干對照表.get(八字.getYearGan())!,
    ];

    const 地支本命 = [
      地支對照表.get(八字.getTimeZhi())!,
      地支對照表.get(八字.getDayZhi())!,
      地支對照表.get(八字.getMonthZhi())!,
      地支對照表.get(八字.getYearZhi())!,
    ];

    const 大運列 = lunar
      .getEightChar()
      .getYun(isMale ? 1 : 0, 1)
      .getDaYun()
      .map((dayun) => new 大運(dayun));

    const 生肖列 = [
      `${cn2tw(lunar.getYearShengXiao())}年`,
      `${cn2tw(lunar.getMonthShengXiao())}月`,
      `${cn2tw(lunar.getDayShengXiao())}日`,
      `${cn2tw(lunar.getTimeShengXiao())}時`
    ];

    return {
      天干本命,
      地支本命,
      大運列,
      生肖列,
    };
  }

  生成天干地支命盤(solar: Date, isMale?: boolean) {
    const 基礎命盤 = this.創建基礎命盤(solar, isMale);
    const 大運列 = 基礎命盤.大運列;

    const 結果命盤: 命盤[] = [];
    const myFateSet = { gan: 基礎命盤.天干本命, zhi: 基礎命盤.地支本命 };
    // const chineseZodiac = {}


    for (const 大運值 of 大運列) {
      const bigFortune = { gan: 大運值.天干, zhi: 大運值.地支 };
      for (const 流年值 of 大運值.流年) {
        const yearFortune = { gan: 流年值.天干, zhi: 流年值.地支 };
        const data = {
          year: 流年值.年,
          myFateSet,
          bigFortune,
          yearFortune,
          monthFortune: 流年值.流月,
          chineseZodiac: 基礎命盤.生肖列
        };
        const 新命盤 = new 命盤(data);
        結果命盤.push(新命盤);
      }
    }

    return 結果命盤;
  }

  生成特定天干地支命盤(dob: Date, year: number, isMale?: boolean): 命盤 | null {
    const 基礎命盤 = this.創建基礎命盤(dob, isMale);
    const 大運列 = 基礎命盤.大運列;
    const myFateSet = { gan: 基礎命盤.天干本命, zhi: 基礎命盤.地支本命 };

    for (const 大運值 of 大運列) {
      const bigFortune = { gan: 大運值.天干, zhi: 大運值.地支 };
      for (const 流年值 of 大運值.流年) {
        if (year === 流年值.年) {
          const yearFortune = { gan: 流年值.天干, zhi: 流年值.地支 };
          const data = { year: 流年值.年, myFateSet, bigFortune, yearFortune, monthFortune: 流年值.流月, chineseZodiac: 基礎命盤.生肖列 };
          const 新命盤 = new 命盤(data);
          return 新命盤;
        }
      }
    }

    return null;
  }
}
