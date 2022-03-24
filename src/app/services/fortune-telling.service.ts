import { Injectable } from '@angular/core';
import { 相合對照表 } from 'src/app/constants/constants';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 地支命盤, 天干命盤 } from 'src/app/interfaces/命盤';

@Injectable({
  providedIn: 'root',
})
export class FortuneTellingService {
  算天干(對象命盤: 天干命盤) {
    this.大運流年合(對象命盤);
    this.本命合(對象命盤, true);
    this.本命大運流年合(對象命盤, true);
  }

  private 大運流年合(對象命盤: 天干命盤 | 地支命盤) {
    if (this.是否相合(對象命盤.大運, 對象命盤.流年)) {
      對象命盤.命盤結果.大運已合 = true;
      對象命盤.命盤結果.流年已合 = true;
    }
  }

  private 本命大運流年合(對象命盤: 天干命盤 | 地支命盤, 是否為天干: boolean) {
    const 已合走: (天干 | 地支)[][] = [];
    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      const 大運本命未先合 = !(對象命盤.命盤結果.大運已合 || 對象命盤.命盤結果[this.年月日時轉換(i)]);

      if (大運本命未先合 && this.是否相合(對象命盤.本命[i], 對象命盤.大運)) {
        已合走.push([對象命盤.本命[i], 對象命盤.大運]);
        對象命盤.命盤結果[this.年月日時轉換(i)] = true;
        對象命盤.命盤結果.大運已合 = true;
        return;
      }

      if (大運本命未先合 && this.是否相合(對象命盤.本命[i], 對象命盤.流年)) {
        已合走.push([對象命盤.本命[i], 對象命盤.流年]);
        對象命盤.命盤結果[this.年月日時轉換(i)] = true;
        對象命盤.命盤結果.流年已合 = true;
        return;
      }
    }
  }

  private 本命合(對象命盤: 天干命盤 | 地支命盤, 是否為天干: boolean) {
    for (let i = 0; i < 對象命盤.本命.length - 1; i++) {
      if (是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      let nextPointer = 是否為天干 && i + 1 === 1 ? i + 2 : i + 1;

      do {
        if (!對象命盤.命盤結果[this.年月日時轉換(nextPointer)]) {
          break;
        }
        nextPointer++;
      } while (nextPointer < 對象命盤.本命.length);

      if (this.是否相合(對象命盤.本命[i], 對象命盤.本命[nextPointer])) {
        對象命盤.命盤結果[this.年月日時轉換(i)] = true;
        對象命盤.命盤結果[this.年月日時轉換(nextPointer)] = true;
      }
    }
  }

  private 是否相合(key: 天干 | 地支, value: 天干 | 地支) {
    return 相合對照表.get(key) === value;
  }

  private 年月日時轉換(i: number) {
    switch (i) {
      case 0:
        return 命盤結果屬性.時住已合;
      case 1:
        return 命盤結果屬性.日住已合;
      case 2:
        return 命盤結果屬性.月住已合;
      case 3:
        return 命盤結果屬性.年住已合;
      default:
        throw new Error('輸入錯誤的值');
    }
  }
}
