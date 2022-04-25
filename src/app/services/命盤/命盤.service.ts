import { Injectable } from '@angular/core';

import { 天干對照表, 地支對照表 } from 'src/app/constants/constants';
import { 命盤, 命盤結果, 地支命盤, 天干命盤 } from 'src/app/interfaces/命盤';
import { Lunar } from 'lunar-typescript';
import { 大運 } from 'src/app/interfaces/大運';

@Injectable({
  providedIn: 'root',
})
export class 命盤服務器 {
  創建基礎命盤(solar: Date, isMale?: boolean) {
    const lunar = Lunar.fromDate(solar);
    const 天干本命 = [
      天干對照表.get(lunar.getTimeGan())!,
      天干對照表.get(lunar.getDayGan())!,
      天干對照表.get(lunar.getMonthGan())!,
      天干對照表.get(lunar.getYearGan())!,
    ];

    const 地支本命 = [
      地支對照表.get(lunar.getTimeZhi())!,
      地支對照表.get(lunar.getDayZhi())!,
      地支對照表.get(lunar.getMonthZhi())!,
      地支對照表.get(lunar.getYearZhi())!,
    ];

    const 大運列 = lunar
      .getEightChar()
      .getYun(isMale ? 1 : 0)
      .getDaYun()
      .map((dayun) => new 大運(dayun));

    return {
      天干本命,
      地支本命,
      大運列,
    };
  }

  生成天干地支命盤(solar: Date, isMale?: boolean) {
    const 基礎命盤 = this.創建基礎命盤(solar, isMale);
    const 大運列 = 基礎命盤.大運列;

    const 結果命盤: 命盤 = { 天干: [], 地支: [] };

    for (const 大運值 of 大運列) {
      let 暫存天干: 天干命盤[] = [];
      let 暫存地支: 地支命盤[] = [];
      for (const 流年值 of 大運值.流年) {
        暫存天干.push({
          year: 流年值.年,
          命盤結果: new 命盤結果(),
          本命: 基礎命盤.天干本命,
          大運: 大運值.天干,
          流年: 流年值.天干,
        });

        暫存地支.push({
          year: 流年值.年,
          命盤結果: new 命盤結果(),
          本命: 基礎命盤.地支本命,
          大運: 大運值.地支,
          流年: 流年值.地支,
        });
      }
      結果命盤.天干 = 結果命盤.天干.concat(暫存天干);
      結果命盤.地支 = 結果命盤.地支.concat(暫存地支);
    }

    return 結果命盤;
  }
}
