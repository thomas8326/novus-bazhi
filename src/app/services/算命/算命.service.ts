import { Injectable } from '@angular/core';
import { 五行互救對照表, 五行相刻對照表, 五行轉換, 相合對照表, 陰列, 陽列 } from 'src/app/constants/constants';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 地支命盤, 天干命盤 } from 'src/app/interfaces/命盤';

@Injectable({
  providedIn: 'root',
})
export class 算命服務器 {
  private 是否為天干: boolean = false;

  算天干(對象命盤: 天干命盤) {
    this.是否為天干 = true;
    this.大運流年相合(對象命盤);
    this.本命合(對象命盤);
    this.本命與大運流年合或剋(對象命盤);
    this.本命合(對象命盤);
  }

  算地支(對象命盤: 地支命盤) {
    this.是否為天干 = false;
    this.大運流年相合(對象命盤);
    this.本命合(對象命盤);
    this.本命與大運流年合或剋(對象命盤);
    this.本命合(對象命盤);
  }

  // 命盤分析結果(對象命盤: 天干命盤 | 地支命盤) {

  // }

  private 大運流年相合(對象命盤: 天干命盤 | 地支命盤) {
    if (this.是否相合(對象命盤.大運, 對象命盤.流年)) {
      對象命盤.命盤結果.大運已作用 = true;
      對象命盤.命盤結果.流年已作用 = true;
      this.大運流年消相同本命(對象命盤, 對象命盤.大運, 對象命盤.流年);
    }
  }

  private 流年剋大運(對象命盤: 天干命盤 | 地支命盤) {
    return !對象命盤.命盤結果.流年已作用 && this.是否相刻(對象命盤.流年, 對象命盤.大運);
  }

  private 大運剋流年(對象命盤: 天干命盤 | 地支命盤) {
    return !對象命盤.命盤結果.大運已作用 && this.是否相刻(對象命盤.大運, 對象命盤.流年);
  }

  private 大運流年相剋找人救(對象命盤: 天干命盤 | 地支命盤) {
    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      // 救流年
      if (!對象命盤.命盤結果[this.年月日時住轉換(i)] && this.是否能救(對象命盤.本命[i], 對象命盤.大運, 對象命盤.流年)) {
        return true;
      }

      // 救大運
      if (!對象命盤.命盤結果[this.年月日時住轉換(i)] && this.是否能救(對象命盤.本命[i], 對象命盤.流年, 對象命盤.大運)) {
        return true;
      }
    }
    return false;
  }

  private 大運流年消相同本命(對象命盤: 天干命盤 | 地支命盤, 消失目標1: 天干 | 地支, 消失目標2?: 天干 | 地支) {
    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      if (對象命盤.本命[i] === 消失目標1 || 對象命盤.本命[i] === 消失目標2) {
        對象命盤.命盤結果[this.年月日時住轉換(i)] = true;
      }
    }
  }

  private 本命與大運流年合或剋(對象命盤: 天干命盤 | 地支命盤) {
    let 準備解合物件: 命盤結果屬性 | null = null;
    let 消相同本命: 天干 | 地支 | null = null;
    let 本命已與大運流年相合 = false;

    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      const 大運本命未先合 = () => !(對象命盤.命盤結果.大運已作用 || 對象命盤.命盤結果[this.年月日時住轉換(i)]);
      const 流年本命未先合 = () => !(對象命盤.命盤結果.流年已作用 || 對象命盤.命盤結果[this.年月日時住轉換(i)]);

      const 大運本命相合 = 大運本命未先合() && this.是否相合(對象命盤.本命[i], 對象命盤.大運);
      const 流年本命相合 = 流年本命未先合() && this.是否相合(對象命盤.本命[i], 對象命盤.流年);

      if (大運本命相合) {
        準備解合物件 = this.年月日時住轉換(i);
        消相同本命 = 對象命盤.大運;
        對象命盤.命盤結果[準備解合物件] = true;
        對象命盤.命盤結果.大運已作用 = true;
        本命已與大運流年相合 = true;
      }

      if (流年本命相合) {
        消相同本命 = 對象命盤.流年;
        對象命盤.命盤結果[this.年月日時住轉換(i)] = true;
        對象命盤.命盤結果.流年已作用 = true;
        本命已與大運流年相合 = true;
      }
    }

    const 大運剋流年 = !本命已與大運流年相合 && this.大運剋流年(對象命盤);
    const 流年剋大運 = this.流年剋大運(對象命盤); // 有解合的情況發生不用確認本命是否已與大運或流年相合

    if (大運剋流年 || 流年剋大運) {
      if (this.大運流年相剋找人救(對象命盤)) {
        return;
      }

      if (大運剋流年) {
        對象命盤.命盤結果.大運已作用 = false;
        對象命盤.命盤結果.流年已作用 = true;
      }

      if (流年剋大運) {
        if (!!準備解合物件) 對象命盤.命盤結果[準備解合物件] = false; // 解合
        對象命盤.命盤結果.大運已作用 = true;
        對象命盤.命盤結果.流年已作用 = false;
      }

      this.大運流年消相同本命(對象命盤, 大運剋流年 ? 對象命盤.流年 : 對象命盤.大運);
    } else {
      this.大運流年消相同本命(對象命盤, 消相同本命!);
    }
  }

  private 本命合(對象命盤: 天干命盤 | 地支命盤) {
    for (let i = 0; i < 對象命盤.本命.length - 1; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      let nextPointer = this.是否為天干 && i + 1 === 1 ? i + 2 : i + 1;

      do {
        if (!對象命盤.命盤結果[this.年月日時住轉換(i)] && !對象命盤.命盤結果[this.年月日時住轉換(nextPointer)]) {
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

  private 是否相刻(作用主體: 天干 | 地支, 被作用目標: 天干 | 地支) {
    const 不是陰剋陽作用主體 = !this.是否陰作用陽(作用主體, 被作用目標);
    const 作用主體五行 = 五行轉換(作用主體);
    const 被作用目標五行 = 五行轉換(被作用目標);

    return 不是陰剋陽作用主體 && 五行相刻對照表.get(作用主體五行) === 被作用目標五行;
  }

  private 是否能救(本命: 天干 | 地支, 作用主體: 天干 | 地支, 被作用目標: 天干 | 地支) {
    const 本命五行 = 五行轉換(本命);
    const 被作用五行 = 五行轉換(被作用目標);
    const 不是陰剋陽作用主體 = !this.是否陰作用陽(本命, 作用主體);
    const 不是陰救陽被作用目標 = !this.是否陰作用陽(本命, 被作用目標);
    const 不是同五行陽救陽 = 本命五行 !== 被作用五行;

    return (
      不是陰剋陽作用主體 &&
      不是陰救陽被作用目標 &&
      不是同五行陽救陽 &&
      五行互救對照表.get(本命五行)?.find((data) => data === 被作用五行)
    );
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

  private 是否陰作用陽(目標: 天干 | 地支, 被剋: 天干 | 地支) {
    return 陰列.find((陰屬性) => 目標 === 陰屬性) && 陽列.find((陽屬性) => 被剋 === 陽屬性);
  }
}
