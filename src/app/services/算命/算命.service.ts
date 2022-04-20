import { Injectable } from '@angular/core';

import {
  五行互救對照表,
  五行相刻對照表,
  五行相生,
  五行相生對照表,
  五行轉換,
  相合對照表,
  陰列,
  陽列,
} from 'src/app/constants/constants';
import { 五行 } from 'src/app/enums/五行.enum';
import { 命盤結果屬性 } from 'src/app/enums/命盤.enum';
import { 地支 } from 'src/app/enums/地支.enum';
import { 天干 } from 'src/app/enums/天干.enum';
import { 五行結果, 地支命盤, 天干命盤 } from 'src/app/interfaces/命盤';

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
    this.命盤分析結果(對象命盤);
  }

  算地支(對象命盤: 地支命盤) {
    this.是否為天干 = false;
    this.大運流年相合(對象命盤);
    this.本命合(對象命盤);
    this.本命與大運流年合或剋(對象命盤);
    this.本命合(對象命盤);
    // this.命盤分析結果(對象命盤);
  }

  //'辛', '戊', '壬', '丙' "壬" 戊
  命盤分析結果(對象命盤: 天干命盤 | 地支命盤) {
    const { 陽, 陰 } = this.先分陰陽(對象命盤);
    // const 陽流通陣列 = this.test(陽);
    const 陽流通陣列 = this.先生後剋(陽);
    const 陽流通陣列補陰 = this.當生陽大於剋陽時補陰(陽流通陣列, 陰);

    const 批陽結果 = 對象命盤.命盤結果.先批陽(陽流通陣列補陰.陽結果);

    const 流通陣列 = this.五行結果流通(批陽結果, 陰);
    對象命盤.命盤結果.再流通(流通陣列);
    console.log('');
    // const 被剋天干地支 = 陽流通陣列.find((value) => value.生剋 === '剋')?.陽陣[0];

    // if (被剋天干地支) {
    //   const index = 陽.indexOf(被剋天干地支);
    //   陽.splice(index, 1);
    // }

    // const 陰流通陣列 = this.批陽先生後剋(陽, 陰);
    // 對象命盤.命盤結果.新增五行流通結果(陰流通陣列);

    // const 陰流通陣列 = this.test2(陽流通陣列, 陰);
    // const 陽五行陣列 = this.劃分五行(陽);
    // const 陽流通陣列 = this.先生後剋(陽五行陣列);
    // const 陰流通陣列 = this.陰先生後剋(陽流通陣列, 陰);
    // 對象命盤.命盤結果.新增五行流通結果(陰流通陣列);
  }

  private 先生後剋(天干地支: (天干 | 地支)[], 是否為陽 = true) {
    const 五行結果表: 五行結果[] = [
      { 五行: 五行.金, 生剋: '生', 陽陣: [], 陰陣: [] },
      { 五行: 五行.水, 生剋: '生', 陽陣: [], 陰陣: [] },
      { 五行: 五行.木, 生剋: '生', 陽陣: [], 陰陣: [] },
      { 五行: 五行.火, 生剋: '生', 陽陣: [], 陰陣: [] },
      { 五行: 五行.土, 生剋: '生', 陽陣: [], 陰陣: [] },
    ];

    五行結果表.forEach((value) => {
      const 結果 = 天干地支.filter((data) => 五行轉換(data) === value.五行);
      if (!結果.length) {
        return;
      }

      if (是否為陽) {
        value.陽陣 = value.陽陣.concat(結果);
      } else {
        value.陰陣 = value.陰陣.concat(結果);
      }
    });

    let result: 五行結果[] = [];
    let 暫存五行結果: 五行結果[] = [];
    const 相剋: 五行結果[] = [];

    for (let i = 0; i < 五行結果表.length; i++) {
      const 相生表: number[] = 五行相生.get(五行結果表[i].五行)!;

      if (this.五行是否會被剋(五行結果表, i)) {
        相剋.push(五行結果表[i]);
      }

      for (let j = 0; j < 相生表.length; j++) {
        if (五行結果表[相生表[j]].陽陣.length || 五行結果表[相生表[j]].陰陣.length) {
          暫存五行結果.push(五行結果表[相生表[j]]);
        } else {
          break;
        }
      }
      result = result.length > 暫存五行結果.length ? result : 暫存五行結果;
      暫存五行結果 = [];
    }

    for (const 剋 of 相剋) {
      if (五行相刻對照表.get(result[result.length - 1].五行) === 剋.五行) {
        剋.生剋 = '剋';
        result.push(剋);
        return result;
      }
      if (五行相刻對照表.get(剋.五行) === result[result.length - 1].五行) {
        result.unshift(剋);
        result[result.length - 1].生剋 = '剋';
        return result;
      }
    }
    return result;
  }

  private 五行結果流通(五行結果表: 五行結果[], 陰: (天干 | 地支)[]) {
    const 陰流通陣列 = this.先生後剋(陰, false);

    if (!陰.length) {
      return 五行結果表;
    }

    let 結果索引 = 0;
    let retry = 1;
    while (五行結果表.length !== 0 && retry <= 3) {
      if (結果索引 >= 五行結果表.length) {
        結果索引 = 0;
        retry++;
      }

      const currentValue = 五行結果表[結果索引];
      const findResult = 陰流通陣列.find((結果) => 結果.五行 === currentValue.五行);
      let 有相生 = false;

      if (findResult) {
        findResult.陽陣.push(...currentValue.陽陣);
        findResult.陰陣.push(...currentValue.陰陣);
        有相生 = true;
      } else {
        for (let i = 陰流通陣列.length - 1; i >= 0; i--) {
          if (五行相生對照表.get(currentValue.五行) === 陰流通陣列[i].五行) {
            陰流通陣列[i].生剋 = '生';
            陰流通陣列.splice(i, 0, currentValue);
            有相生 = true;
            break;
          }
          if (五行相生對照表.get(陰流通陣列[i].五行) === currentValue.五行) {
            currentValue.生剋 = '生';
            陰流通陣列.splice(i + 1, 0, currentValue);
            有相生 = true;
            break;
          }
        }
      }

      if (有相生) {
        五行結果表.splice(結果索引, 1);
        結果索引 = 0;
      } else {
        結果索引++;
      }
    }

    if (五行結果表.length > 1) {
      throw new Error(`這裡有特殊狀況！剩餘結果表: ${五行結果表.toString()} 結果: ${陰流通陣列}`);
    }

    if (五行結果表.length === 1) {
      const 剩餘五行結果 = 五行結果表[五行結果表.length - 1];
      if (五行相刻對照表.get(陰流通陣列[陰流通陣列.length - 1].五行) === 剩餘五行結果.五行) {
        剩餘五行結果.生剋 = '剋';
        陰流通陣列.push(剩餘五行結果);
        return 陰流通陣列;
      }
      if (五行相刻對照表.get(剩餘五行結果.五行) === 陰流通陣列[陰流通陣列.length - 1].五行) {
        陰流通陣列.unshift(剩餘五行結果);
        陰流通陣列[陰流通陣列.length - 1].生剋 = '剋';
        return 陰流通陣列;
      }
    }

    return 陰流通陣列;
  }

  private 當生陽大於剋陽時補陰(陽結果: 五行結果[], 陰: (天干 | 地支)[]) {
    if (陽結果.length < 2 || 陽結果[陽結果.length - 1].生剋 !== '剋') {
      return { 陽結果, 陰 };
    }

    const 剋 = 陽結果[陽結果.length - 1];
    const 生 = 陽結果[陽結果.length - 2];

    for (let i = 0; i < 陰.length; i++) {
      if (生.陽陣.length <= 剋.陽陣.length) {
        return { 陽結果, 陰 };
      }

      if (五行轉換(陰[i]) === 剋.五行) {
        剋.陰陣 = 剋.陰陣.concat(陰[i]);
        陰.splice(i, 1);
      }
    }

    return { 陽結果, 陰 };
  }

  五行是否會被剋(結果: 五行結果[], index: number) {
    let 前索引 = index - 1;
    let 後索引 = index + 1;

    if (index === 0) {
      前索引 = 結果.length - 1;
    }

    if (index === 結果.length - 1) {
      後索引 = 0;
    }

    const 本身有值 = 結果[index].陽陣.length || 結果[index].陰陣.length;
    const 前後無值 =
      !結果[前索引].陽陣.length && !結果[前索引].陰陣.length && !結果[後索引].陽陣.length && !結果[後索引].陰陣.length;
    return 本身有值 && 前後無值;
  }

  private 先分陰陽(對象命盤: 天干命盤 | 地支命盤) {
    const 陽: (天干 | 地支)[] = [];
    const 陰: (天干 | 地支)[] = [];

    const 新增陰陽 = (target: 天干 | 地支) => {
      const 是否為陽 = 陽列.find((陽本命) => 陽本命 === target);

      if (是否為陽) {
        陽.push(target);
      } else {
        陰.push(target);
      }
    };

    if (!對象命盤.命盤結果.作用.大運已作用) 新增陰陽(對象命盤.大運);
    if (!對象命盤.命盤結果.作用.流年已作用) 新增陰陽(對象命盤.流年);

    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      if (!對象命盤.命盤結果.作用[this.年月日時住轉換(i)]) {
        新增陰陽(對象命盤.本命[i]);
      }
    }

    return { 陽, 陰 };
  }

  private 大運流年相合(對象命盤: 天干命盤 | 地支命盤) {
    if (this.是否相合(對象命盤.大運, 對象命盤.流年)) {
      對象命盤.命盤結果.作用.大運已作用 = true;
      對象命盤.命盤結果.作用.流年已作用 = true;
      this.大運流年消相同本命(對象命盤, 對象命盤.大運, 對象命盤.流年);
    }
  }

  private 流年剋大運(對象命盤: 天干命盤 | 地支命盤) {
    return !對象命盤.命盤結果.作用.流年已作用 && this.是否相刻(對象命盤.流年, 對象命盤.大運);
  }

  private 大運剋流年(對象命盤: 天干命盤 | 地支命盤) {
    return !對象命盤.命盤結果.作用.大運已作用 && this.是否相刻(對象命盤.大運, 對象命盤.流年);
  }

  private 大運流年相剋找人救(對象命盤: 天干命盤 | 地支命盤) {
    for (let i = 0; i < 對象命盤.本命.length; i++) {
      if (this.是否為天干 && i === 1) {
        // 日住不作用
        continue;
      }

      // 救流年
      if (
        !對象命盤.命盤結果.作用[this.年月日時住轉換(i)] &&
        this.是否能救(對象命盤.本命[i], 對象命盤.大運, 對象命盤.流年)
      ) {
        return true;
      }

      // 救大運
      if (
        !對象命盤.命盤結果.作用[this.年月日時住轉換(i)] &&
        this.是否能救(對象命盤.本命[i], 對象命盤.流年, 對象命盤.大運)
      ) {
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
        對象命盤.命盤結果.作用[this.年月日時住轉換(i)] = true;
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

      const 大運本命未先合 = () =>
        !(對象命盤.命盤結果.作用.大運已作用 || 對象命盤.命盤結果.作用[this.年月日時住轉換(i)]);
      const 流年本命未先合 = () =>
        !(對象命盤.命盤結果.作用.流年已作用 || 對象命盤.命盤結果.作用[this.年月日時住轉換(i)]);

      const 大運本命相合 = 大運本命未先合() && this.是否相合(對象命盤.本命[i], 對象命盤.大運);
      const 流年本命相合 = 流年本命未先合() && this.是否相合(對象命盤.本命[i], 對象命盤.流年);

      if (大運本命相合) {
        準備解合物件 = this.年月日時住轉換(i);
        消相同本命 = 對象命盤.大運;
        對象命盤.命盤結果.作用[準備解合物件] = true;
        對象命盤.命盤結果.作用.大運已作用 = true;
        本命已與大運流年相合 = true;
      }

      if (流年本命相合) {
        消相同本命 = 對象命盤.流年;
        對象命盤.命盤結果.作用[this.年月日時住轉換(i)] = true;
        對象命盤.命盤結果.作用.流年已作用 = true;
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
        對象命盤.命盤結果.作用.大運已作用 = false;
        對象命盤.命盤結果.作用.流年已作用 = true;
      }

      if (流年剋大運) {
        if (準備解合物件) 對象命盤.命盤結果.作用[準備解合物件] = false; // 解合
        對象命盤.命盤結果.作用.大運已作用 = true;
        對象命盤.命盤結果.作用.流年已作用 = false;
      }

      const 被剋對象 = 大運剋流年 ? 對象命盤.流年 : 對象命盤.大運;

      對象命盤.命盤結果.新增大運流年相剋評分(被剋對象, 大運剋流年);
      this.大運流年消相同本命(對象命盤, 被剋對象);
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
        if (
          !對象命盤.命盤結果.作用[this.年月日時住轉換(i)] &&
          !對象命盤.命盤結果.作用[this.年月日時住轉換(nextPointer)]
        ) {
          break;
        }
        nextPointer++;
      } while (nextPointer < 對象命盤.本命.length);

      if (this.是否相合(對象命盤.本命[i], 對象命盤.本命[nextPointer])) {
        對象命盤.命盤結果.作用[this.年月日時住轉換(i)] = true;
        對象命盤.命盤結果.作用[this.年月日時住轉換(nextPointer)] = true;
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
