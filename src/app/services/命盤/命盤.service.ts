import { Injectable } from '@angular/core';
import { 天干對照表 } from 'src/app/constants/constants';
import { 天干 } from 'src/app/enums/天干.enum';
import { 命盤結果, 天干命盤 } from 'src/app/interfaces/命盤';
import { Lunar } from 'lunar-typescript';
import { 大運 } from 'src/app/interfaces/大運';

@Injectable({
  providedIn: 'root',
})
export class 命盤服務器 {
  創建天干命盤(solar: Date, isMale?: boolean): 天干命盤 {
    const lunar = Lunar.fromDate(solar);
    const 本命 = [
      天干對照表.get(lunar.getTimeGan())!,
      天干對照表.get(lunar.getDayGan())!,
      天干對照表.get(lunar.getMonthGan())!,
      天干對照表.get(lunar.getYearGan())!,
    ];

    const 大運列 = lunar
      .getEightChar()
      .getYun(isMale ? 1 : 0)
      .getDaYun()
      .map((dayun) => new 大運(dayun));

    const 目前大運 = 大運列!.find((data, index) => {
      const nowYear = new Date().getFullYear();
      return data.年 <= nowYear && (nowYear < 大運列[index + 1].年 || !大運列[index + 1]);
    });

    return {
      命盤結果: new 命盤結果(),
      本命: 本命,
      目前大運: 目前大運,
      大運列,
      大運: 天干.丁,
      流年: 天干.丁,
    };
  }
}
