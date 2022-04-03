import { Injectable } from '@angular/core';
import { 天干對照表, 地支對照表 } from 'src/app/constants/constants';
import { 天干 } from 'src/app/enums/天干.enum';
import { 命盤結果, 天干命盤 } from 'src/app/interfaces/命盤';
import { Lunar } from 'lunar-typescript';
import { 大運 } from 'src/app/interfaces/大運';
import { 地支 } from 'src/app/enums/地支.enum';

@Injectable({
  providedIn: 'root',
})
export class 命盤服務器 {
  private 基礎命盤: { 天干本命: 天干[]; 地支本命: 地支[]; 大運列: 大運[] } = {
    天干本命: [],
    地支本命: [],
    大運列: [],
  };

  取得基礎命盤() {
    return this.基礎命盤;
  }

  尋找天干命盤(year: number): 天干命盤 {
    const 大運列 = this.基礎命盤.大運列;

    const 目前大運 = 大運列.find(
      (data, index) => data.年 <= year && (year < 大運列[index + 1].年 || !大運列[index + 1]),
    );

    const 目前流年 = 目前大運?.流年.find((data) => data.年 === year);

    return {
      命盤結果: new 命盤結果(),
      本命: this.基礎命盤.天干本命,
      大運: 目前大運!.天干,
      流年: 目前流年!.天干,
    };
  }

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

    this.基礎命盤 = {
      天干本命,
      地支本命,
      大運列,
    };
  }
}
