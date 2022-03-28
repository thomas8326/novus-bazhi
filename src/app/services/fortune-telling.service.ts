import { Injectable } from '@angular/core';
import { 五行互救對照表, 五行相刻對照表, 五行轉換, 相合對照表, 陰列, 陽列 } from 'src/app/constants/constants';
import { 五行 } from 'src/app/enums/五行.enum';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 地支命盤, 天干命盤 } from 'src/app/interfaces/命盤';

@Injectable({
  providedIn: 'root',
})
export class FortuneTellingService {
  算天干(對象命盤: 天干命盤) {
    this.大運流年相合(對象命盤, true);
    this.本命合(對象命盤, true);
    this.本命大運流年合(對象命盤, true);
    this.大運流年相剋(對象命盤, true);
    this.本命合(對象命盤, true);
  }

  算地支(對象命盤: 地支命盤) {
    this.大運流年相合(對象命盤, false);
    // this.大運流年相剋(對象命盤);
    this.本命合(對象命盤, false);
    this.本命大運流年合(對象命盤, false);
  }

  private 大運流年相合(對象命盤: 天干命盤 | 地支命盤, 是否為天干: boolean) {
    if (this.是否相合(對象命盤.大運, 對象命盤.流年)) {
      對象命盤.命盤結果.大運已作用 = true;
      對象命盤.命盤結果.流年已作用 = true;
      this.大運流年消相同本命(對象命盤, 是否為天干, 對象命盤.大運, 對象命盤.流年);
    }
  }

  private 流年剋大運(對象命盤: 天干命盤 | 地支命盤) {
    if (
      !對象命盤.命盤結果.大運已作用 &&
      !對象命盤.命盤結果.流年已作用 &&
      !this.是否陰剋陽(對象命盤.流年, 對象命盤.大運) &&
      this.是否相刻(五行轉換(對象命盤.流年), 五行轉換(對象命盤.大運))
    ) {
      對象命盤.命盤結果.大運已作用 = true;
      對象命盤.命盤結果.流年已作用 = false;

      return true;
    }

    return false;
  }

  private 大運剋流年(對象命盤: 天干命盤 | 地支命盤) {
    if (
      !對象命盤.命盤結果.大運已作用 &&
      !對象命盤.命盤結果.流年已作用 &&
      !this.是否陰剋陽(對象命盤.大運, 對象命盤.流年) &&
      this.是否相刻(五行轉換(對象命盤.大運), 五行轉換(對象命盤.流年))
    ) {
      對象命盤.命盤結果.大運已作用 = false;
      對象命盤.命盤結果.流年已作用 = true;

      return true;
    }

    return false;
  }

  private 大運流年相剋(對象命盤: 天干命盤 | 地支命盤, 是否為天干: boolean) {
    const 是否流年刻大運 = this.流年剋大運(對象命盤);
    const 是否大運刻流年 = this.大運剋流年(對象命盤);

    if (是否流年刻大運 || 是否大運刻流年) {
      if (this.大運流年相剋找人救(對象命盤, 是否為天干)) {
        return;
      }
      const 消被刻本命 = 是否大運刻流年 ? 對象命盤.流年 : 對象命盤.大運;
      this.大運流年消相同本命(對象命盤, 是否為天干, 消被刻本命);
    }
  }

  private 大運流年相剋找人救(對象命盤: 天干命盤 | 地支命盤, 是否為天干: boolean) {
    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      // 救流年
      if (
        !對象命盤.命盤結果[this.年月日時住轉換(i)] &&
        對象命盤.命盤結果.流年已作用 &&
        !this.是否陰剋陽(對象命盤.本命[i], 對象命盤.大運) &&
        this.是否能救(對象命盤.本命[i], 對象命盤.流年)
      ) {
        對象命盤.命盤結果.流年已作用 = false;

        return true;
      }

      // 救大運
      if (
        !對象命盤.命盤結果[this.年月日時住轉換(i)] &&
        對象命盤.命盤結果.大運已作用 &&
        !this.是否陰剋陽(對象命盤.本命[i], 對象命盤.流年) &&
        this.是否能救(對象命盤.本命[i], 對象命盤.大運)
      ) {
        對象命盤.命盤結果.大運已作用 = false;

        return true;
      }
    }
    return false;
  }

  private 大運流年消相同本命(
    對象命盤: 天干命盤 | 地支命盤,
    是否為天干: boolean,
    消失目標1: 天干 | 地支,
    消失目標2?: 天干 | 地支,
  ) {
    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      if (對象命盤.本命[i] === 消失目標1 || 對象命盤.本命[i] === 消失目標2) {
        對象命盤.命盤結果[this.年月日時住轉換(i)] = true;
      }
    }
  }

  private 本命大運流年合(對象命盤: 天干命盤 | 地支命盤, 是否為天干: boolean) {
    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      const 大運本命未先合 = !(對象命盤.命盤結果.大運已作用 || 對象命盤.命盤結果[this.年月日時住轉換(i)]);
      const 流年本命未先合 = !(對象命盤.命盤結果.流年已作用 || 對象命盤.命盤結果[this.年月日時住轉換(i)]);

      if (大運本命未先合 && this.是否相合(對象命盤.本命[i], 對象命盤.大運)) {
        if (this.流年剋大運(對象命盤)) {
          this.大運流年消相同本命(對象命盤, 是否為天干, 對象命盤.大運, 對象命盤.流年);
          return;
        } else {
          對象命盤.命盤結果[this.年月日時住轉換(i)] = true;
          對象命盤.命盤結果.大運已作用 = true;
          this.大運流年消相同本命(對象命盤, 是否為天干, 對象命盤.大運);
        }
      }

      if (流年本命未先合 && this.是否相合(對象命盤.本命[i], 對象命盤.流年)) {
        對象命盤.命盤結果[this.年月日時住轉換(i)] = true;
        對象命盤.命盤結果.流年已作用 = true;
        this.大運流年消相同本命(對象命盤, 是否為天干, 對象命盤.流年);
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
        if (!對象命盤.命盤結果[this.年月日時住轉換(nextPointer)]) {
          break;
        }
        nextPointer++;
      } while (nextPointer < 對象命盤.本命.length);

      if (this.是否相合(對象命盤.本命[i], 對象命盤.本命[nextPointer])) {
        對象命盤.命盤結果[this.年月日時住轉換(i)] = true;
        對象命盤.命盤結果[this.年月日時住轉換(nextPointer)] = true;
      }
    }
  }

  private 是否相合(key: 天干 | 地支, value: 天干 | 地支) {
    return 相合對照表.get(key) === value;
  }

  private 是否相刻(key: 五行, value: 五行) {
    return 五行相刻對照表.get(key) === value;
  }

  private 是否能救(key: 天干 | 地支, value: 天干 | 地支) {
    return 五行互救對照表.get(五行轉換(key))?.find((data) => data === 五行轉換(value));
  }

  private 年月日時住轉換(i: number) {
    switch (i) {
      case 0:
        return 命盤結果屬性.時住已作用;
      case 1:
        return 命盤結果屬性.日住已作用;
      case 2:
        return 命盤結果屬性.月住已作用;
      case 3:
        return 命盤結果屬性.年住已作用;
      default:
        throw new Error('輸入錯誤的值');
    }
  }

  private 是否陰剋陽(目標: 天干 | 地支, 被剋: 天干 | 地支) {
    return 陰列.find((陰屬性) => 目標 === 陰屬性) && 陽列.find((陽屬性) => 被剋 === 陽屬性);
  }
}
